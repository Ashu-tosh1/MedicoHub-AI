/* eslint-disable @typescript-eslint/no-explicit-any */



import React, { useState, useEffect } from "react";
import { CheckCircle} from "lucide-react";
import PatientDetailsStep from "./WorkFlow1";
import OrderTestsStep from "./WorkFlow2";
import ReviewResultsStep from "./WorkFlow3";
import PrescribeMedicationStep from "./WorkFlow4";

type Patient = {
  name: string;
  symptoms: string;
  medicalHistory: string;
  appointmentId: string;
};

type TestItem = {
  testName: string;
  testType: string; 
  description: string;
};

type Medication = {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
};

type Report = {
  id: string;
  name: string;
  status: string;
  type: string;
  date: string;
  patientName: string;
  doctorName: string;
  results?: string;
  fileUrl: string;
};



type ConsultationWorkflowProps = {
  activePatient: Patient;
  consultationStep: number;
  setConsultationStep: React.Dispatch<React.SetStateAction<number>>;
  completeConsultation: () => void;
};

const ConsultationWorkflow: React.FC<ConsultationWorkflowProps> = ({
  activePatient,
  consultationStep,
  setConsultationStep,
  completeConsultation,
}) => {
  const [patientNotes, setPatientNotes] = useState("");
  const [patientSymptoms, setPatientSymptoms] = useState("");
  const [recommendedTests, setRecommendedTests] = useState<TestItem[]>([]);
  const [testResults, setTestResults] = useState("");
  const [medications, setMedications] = useState<Medication[]>([]);
  const [mainReport, setMainReport] = useState<Report | null>(null);
  const [relatedReports, setRelatedReports] = useState<Report[]>([]);
  const [isSubmittingTests, setIsSubmittingTests] = useState(false);
  const [isSubmittingMedications, setIsSubmittingMedications] = useState(false);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  // Fetch symptoms and notes based on appointment ID
  const fetchAppointmentDetails = async (appointmentId: string) => {
    try {
      const response = await fetch('/api/appointments/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appointmentId }),
      });
      const data = await response.json();
      
      if (data.error) {
        console.error(data.error);
        return;
      }
      
      setPatientNotes(data.notes || "");
      setPatientSymptoms(data.symptoms || "");
      
      // If there are recommended tests already, load them
      if (data.recommendedTests) {
        setRecommendedTests(data.recommendedTests.map((test: any) => ({
          testName: test.name,
          testType: test.status || "Pending",
          description: test.description || ""
        })));
      }
      
      // Load test results if available
      if (data.testResults) {
        setTestResults(data.testResults);
      }
      
      // Load medications if available
      if (data.medications) {
        setMedications(data.medications);
      }
    } catch (error) {
      console.error("Error fetching appointment details:", error);
    }
  };

  useEffect(() => {
    if (activePatient.appointmentId) {
      fetchAppointmentDetails(activePatient.appointmentId);
    }
  }, [activePatient]);

  // Fetch medical report when entering step 3
  useEffect(() => {
    if (consultationStep === 3 && activePatient.appointmentId) {
      fetchMedicalReport(activePatient.appointmentId);
    }
  }, [consultationStep, activePatient.appointmentId]);

  const fetchMedicalReport = async (appointmentId: string) => {
    try {
      setIsLoadingReport(true);
      const res = await fetch('/api/tests/results/[id]', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appointmentId: appointmentId }),
      });
      const data = await res.json();
      // const data = await response.json();
      
      if (data.error) {
        console.error(data.error);
        return;
      }
      
      if (data.report) {
        // Transform the report data to match the expected Report type
        const reportData: Report = {
          id: data.report.id || "",
          name: data.report.name || "Medical Report",
          status: data.report.status || "Pending",
          type: data.report.type || "General",
          date: data.report.date || new Date().toISOString(),
          patientName: activePatient.name,
          doctorName: data.report.doctorName || "Doctor",
          results: data.report.results || "",
          fileUrl: data.report.fileUrl || "#"
        };
        
        setMainReport(reportData);
        // Set test results text from the report results
        if (data.report.results) {
          setTestResults(data.report.results);
        }
      }
      
      if (data.relatedReports && Array.isArray(data.relatedReports)) {
        // Transform each related report to match the expected Report type
        const transformedReports: Report[] = data.relatedReports.map((report: any) => ({
          id: report.id || "",
          name: report.name || "Related Report",
          status: report.status || "Pending",
          type: report.type || "General",
          date: report.date || new Date().toISOString(),
          patientName: activePatient.name,
          doctorName: report.doctorName || "Doctor",
          results: report.results || "",
          fileUrl: report.fileUrl || "#"
        }));
        
        setRelatedReports(transformedReports);
      }
    } catch (error) {
      console.error("Error fetching medical report:", error);
    } finally {
      setIsLoadingReport(false);
    }
  };

  const nextConsultationStep = async () => {
    if (consultationStep === 2) {
      // Submit test requests to the API before moving to the next step
      if (recommendedTests.length > 0) {
        await submitTestRequests();
      }

      // If no test results provided yet, set some default ones for demonstration
      if (!testResults) {
        setTestResults("Test results will be available after review.");
      }
    }

    setConsultationStep((prev) => prev + 1);
  };

  const submitTestRequests = async () => {
    if (!activePatient.appointmentId) {
      alert("Appointment ID is required");
      return;
    }
  
    try {
      setIsSubmittingTests(true);
  
      // Fetch both patientId and doctorId from the appointmentId
      const response = await fetch('/api/appointments/getIdboth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appointmentId: activePatient.appointmentId }),
      });
      
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to retrieve patient and doctor IDs');
      }
  
      const { patientId, doctorId } = data;
  
      if (!patientId || !doctorId) {
        alert('Patient or Doctor ID not found');
        return;
      }
  
      // Submit test request
      const testRequestResponse = await fetch('/api/tests/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId,
          doctorId,
          tests: recommendedTests,
        }),
      });
  
      const testRequestData = await testRequestResponse.json();
  
      if (!testRequestResponse.ok) {
        throw new Error(testRequestData.error || 'Failed to submit test requests');
      }
  
      console.log('Tests submitted successfully:', testRequestData);
      alert('Tests submitted successfully!');
    } catch (error) {
      console.error('Error submitting test requests:', error);
      alert('Failed to submit test requests. Please try again.');
    } finally {
      setIsSubmittingTests(false);
    }
  };

  const submitMedications = async () => {
    if (!activePatient.appointmentId || medications.length === 0) {
      alert("Appointment ID and at least one medication are required");
      return;
    }
  
    try {
      setIsSubmittingMedications(true);
  
      // Fetch both patientId and doctorId from the appointmentId
      const response = await fetch('/api/appointments/getIdboth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appointmentId: activePatient.appointmentId }),
      });
      
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to retrieve patient and doctor IDs');
      }
  
      const { patientId, doctorId, conversationId } = data;
  
      if (!patientId || !doctorId) {
        alert('Patient or Doctor ID not found');
        return;
      }
  
      // Submit medications
      const medicationResponse = await fetch('/api/medications/prescribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId,
          doctorId,
          conversationId: conversationId || null,
          medications: medications,
        }),
      });
  
      const medicationData = await medicationResponse.json();
  
      if (!medicationResponse.ok) {
        throw new Error(medicationData.error || 'Failed to submit medications');
      }
  
      console.log('Medications prescribed successfully:', medicationData);
      alert('Medications prescribed successfully!');
      completeConsultation();
    } catch (error) {
      console.error('Error prescribing medications:', error);
      alert('Failed to prescribe medications. Please try again.');
    } finally {
      setIsSubmittingMedications(false);
    }
  };

  const updateReportStatus = async (reportId: string, status: string) => {
    try {
      const response = await fetch(`/api/tests/results/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update report status');
      }
      
      // Update local state if main report
      if (mainReport && mainReport.id === reportId) {
        setMainReport({...mainReport, status});
      }
      
      // Update in related reports if needed
      setRelatedReports(prev =>
        prev.map(report =>
          report.id === reportId ? {...report, status} : report
        )
      );
      
    } catch (error) {
      console.error('Error updating report status:', error);
    }
  };

  return (
    <>
      {/* Step Indicator */}
      <div className="bg-white shadow-sm p-4 border-t border-gray-100">
        <div className="flex justify-between">
          {["Patient Details", "Order Tests", "Review Results", "Prescribe Medicine"].map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  consultationStep > index + 1
                    ? "bg-green-500 text-white"
                    : consultationStep === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {consultationStep > index + 1 ? <CheckCircle size={16} /> : index + 1}
              </div>
              <div className="mt-1 text-xs font-medium text-gray-600">{step}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        {/* Step 1: Patient Details */}
        {consultationStep === 1 && (
          <PatientDetailsStep
            patientSymptoms={patientSymptoms}
            patientMedicalHistory={activePatient.medicalHistory}
            patientNotes={patientNotes}
            setPatientNotes={setPatientNotes}
            onNext={nextConsultationStep}
          />
        )}

        {/* Step 2: Order Tests */}
        {consultationStep === 2 && (
          <OrderTestsStep
            recommendedTests={recommendedTests}
            setRecommendedTests={setRecommendedTests}
            isSubmittingTests={isSubmittingTests}
            onNext={nextConsultationStep}
          />
        )}

        {/* Step 3: Review Results */}
        {consultationStep === 3 && (
          <ReviewResultsStep
            isLoadingReport={isLoadingReport}
            mainReport={mainReport || {
              id: "",
              name: "Loading Report",
              status: "Pending",
              type: "General",
              date: new Date().toISOString(),
              patientName: activePatient.name,
              doctorName: "Doctor",
              fileUrl: "#"
            }}
            relatedReports={relatedReports}
            testResults={testResults}
            updateReportStatus={updateReportStatus}
            onNext={nextConsultationStep}
          />
        )}

        {/* Step 4: Prescribe Medication */}
        {consultationStep === 4 && (
          <PrescribeMedicationStep
            medications={medications}
            setMedications={setMedications}
            isSubmittingMedications={isSubmittingMedications}
            onSubmit={submitMedications}
          />
        )}
      </div>
    </>
  );
};

export default ConsultationWorkflow;