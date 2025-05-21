/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState, useEffect } from "react";
// import { CheckCircle, ChevronRight, ArrowRight, Clipboard, FileText, Edit, Plus, X, Download, Eye, Calendar, User, CheckSquare } from "lucide-react";

// type Patient = {
//   name: string;
//   symptoms: string;
//   medicalHistory: string;
//   appointmentId: string;
// };

// type Test = {
//   testName: string;
//   testType: string;
//   description: string;
// };

// type Medication = {
//   name: string;
//   dosage: string;
//   instructions: string;
//   frequency?: string;
//   duration?: string;
// };

// type MedicalReport = {
//   id: string;
//   name: string;
//   type: string;
//   fileUrl: string;
//   results: string;
//   date: string;
//   status: string;
//   patientId: string;
//   patientName: string;
//   doctorId: string;
//   doctorName: string;
//   testRequest: {
//     testName: string;
//     description: string;
//   } | null;
// };

// type ConsultationWorkflowProps = {
//   activePatient: Patient;
//   consultationStep: number;
//   setConsultationStep: React.Dispatch<React.SetStateAction<number>>;
//   completeConsultation: () => void;
// };

// const ConsultationWorkflow: React.FC<ConsultationWorkflowProps> = ({
//   activePatient,
//   consultationStep,
//   setConsultationStep,
//   completeConsultation,
// }) =>  {
//   const [patientNotes, setPatientNotes] = useState("");
//   const [patientSymptoms, setPatientSymptoms] = useState("");

//   const [recommendedTests, setRecommendedTests] = useState<Test[]>([]);
//   const [newTest, setNewTest] = useState<Test>({
//     testName: "",
//     testType: "",
//     description: "",
//   });
//   const [testResults, setTestResults] = useState("");
//   const [mainReport, setMainReport] = useState<MedicalReport | null>(null);
//   const [relatedReports, setRelatedReports] = useState<MedicalReport[]>([]);
//   const [selectedFile, setSelectedFile] = useState<MedicalReport | null>(null);
//   const [showPdfViewer, setShowPdfViewer] = useState(false);
  
//   const [medications, setMedications] = useState<Medication[]>([]);
//   const [newMedication, setNewMedication] = useState<Medication>({
//     name: "",
//     dosage: "",
//     instructions: "",
//     frequency: "",
//     duration: "",
//   });
//   const [isSubmittingTests, setIsSubmittingTests] = useState(false);
//   const [isSubmittingMedications, setIsSubmittingMedications] = useState(false);
//   const [isLoadingReport, setIsLoadingReport] = useState(false);

//   // Fetch symptoms and notes based on appointment ID
//   const fetchAppointmentDetails = async (appointmentId: string) => {
//     try {
//       const response = await fetch(`/api/appointments/details/${appointmentId}`);
//       const data = await response.json();
      
//       if (data.error) {
//         console.error(data.error);
//         return;
//       }
//       console.log(data);
//       setPatientNotes(data.notes || "");
//       // setPatientSymptoms(Array.isArray(data.symptoms) ? data.symptoms.join(", ") : "");
//       setPatientSymptoms(data.symptoms || "");


      
//       // If there are recommended tests already, load them
//       if (data.recommendedTests) {
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         setRecommendedTests(data.recommendedTests.map((test: any) => ({
//           testName: test.name,
//           testType: test.status || "Pending",
//           description: test.description || ""
//         })));
//       }
      
//       // Load test results if available
//       if (data.testResults) {
//         setTestResults(data.testResults);
//       }
      
//       // Load medications if available
//       if (data.medications) {
//         setMedications(data.medications);
//       }
//     } catch (error) {
//       console.error("Error fetching appointment details:", error);
//     }
//   };

//   useEffect(() => {
//     if (activePatient.appointmentId) {
//       fetchAppointmentDetails(activePatient.appointmentId);
//     }
//   }, [activePatient]);

//   // Fetch medical report when entering step 3
//   useEffect(() => {
//     if (consultationStep === 3 && activePatient.appointmentId) {
//       fetchMedicalReport(activePatient.appointmentId);
//     }
//   }, [consultationStep, activePatient.appointmentId]);

//   const fetchMedicalReport = async (appointmentId: string) => {
//     try {
//       setIsLoadingReport(true);
//       const response = await fetch(`/api/tests/results/${appointmentId}`);
//       const data = await response.json();
//       console.log("Medical Report Data:", data);
      
//       if (data.error) {
//         console.error(data.error);
//         return;
//       }
      
//       if (data.report) {
//         setMainReport(data.report);
//         // Set test results text from the report results
//         if (data.report.results) {
//           setTestResults(data.report.results);
//         }
//       }
      
//       if (data.relatedReports && Array.isArray(data.relatedReports)) {
//         setRelatedReports(data.relatedReports);
//       }
//     } catch (error) {
//       console.error("Error fetching medical report:", error);
//     } finally {
//       setIsLoadingReport(false);
//     }
//   };

//   const nextConsultationStep = async () => {
//     if (consultationStep === 2) {
//       // Submit test requests to the API before moving to the next step
//       if (recommendedTests.length > 0) {
//         await submitTestRequests();
//       }

//       // If no test results provided yet, set some default ones for demonstration
//       if (!testResults) {
//         setTestResults("Test results will be available after review.");
//       }
//     }

//     setConsultationStep((prev) => prev + 1);
//   };

//   const submitTestRequests = async () => {
//     if (!activePatient.appointmentId) {
//       alert("Appointment ID is required");
//       return;
//     }
  
//     try {
//       setIsSubmittingTests(true);
  
//       // Fetch both patientId and doctorId from the appointmentId
//       const response = await fetch('/api/appointments/getIdboth', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ appointmentId: activePatient.appointmentId }),
//       });
      
//       const data = await response.json();
  
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to retrieve patient and doctor IDs');
//       }
  
//       const { patientId, doctorId } = data;
  
//       if (!patientId || !doctorId) {
//         alert('Patient or Doctor ID not found');
//         return;
//       }
  
//       // Submit test request
//       const testRequestResponse = await fetch('/api/tests/add', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           patientId,
//           doctorId,
//           tests: recommendedTests,
//         }),
//       });
  
//       const testRequestData = await testRequestResponse.json();
  
//       if (!testRequestResponse.ok) {
//         throw new Error(testRequestData.error || 'Failed to submit test requests');
//       }
  
//       console.log('Tests submitted successfully:', testRequestData);
//       alert('Tests submitted successfully!');
//     } catch (error) {
//       console.error('Error submitting test requests:', error);
//       alert('Failed to submit test requests. Please try again.');
//     } finally {
//       setIsSubmittingTests(false);
//     }
//   };

//   const submitMedications = async () => {
//     if (!activePatient.appointmentId || medications.length === 0) {
//       alert("Appointment ID and at least one medication are required");
//       return;
//     }
  
//     try {
//       setIsSubmittingMedications(true);
  
//       // Fetch both patientId and doctorId from the appointmentId
//       const response = await fetch('/api/appointments/getIdboth', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ appointmentId: activePatient.appointmentId }),
//       });
      
//       const data = await response.json();
  
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to retrieve patient and doctor IDs');
//       }
  
//       const { patientId, doctorId, conversationId } = data;
  
//       if (!patientId || !doctorId) {
//         alert('Patient or Doctor ID not found');
//         return;
//       }
  
//       // Submit medications
//       const medicationResponse = await fetch('/api/medications/prescribe', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           patientId,
//           doctorId,
//           conversationId: conversationId || null,
//           medications: medications,
//         }),
//       });
  
//       const medicationData = await medicationResponse.json();
  
//       if (!medicationResponse.ok) {
//         throw new Error(medicationData.error || 'Failed to submit medications');
//       }
  
//       console.log('Medications prescribed successfully:', medicationData);
//       alert('Medications prescribed successfully!');
//       completeConsultation();
//     } catch (error) {
//       console.error('Error prescribing medications:', error);
//       alert('Failed to prescribe medications. Please try again.');
//     } finally {
//       setIsSubmittingMedications(false);
//     }
//   };

//   const addTest = () => {
//     if (
//       newTest.testName.trim() &&
//       newTest.testType.trim()
//     ) {
//       setRecommendedTests((prev) => [...prev, newTest]);
//       setNewTest({ testName: "", testType: "", description: "" });
//     }
//   };

//   const removeTest = (index: number) => {
//     setRecommendedTests((prev) => prev.filter((_, i) => i !== index));
//   };

//   const addMedication = () => {
//     if (
//       newMedication.name.trim() &&
//       newMedication.dosage.trim() &&
//       newMedication.instructions.trim()
//     ) {
//       setMedications((prev) => [...prev, newMedication]);
//       setNewMedication({
//         name: "",
//         dosage: "",
//         instructions: "",
//         frequency: "",
//         duration: ""
//       });
//     }
//   };

//   const removeMedication = (index: number) => {
//     setMedications((prev) => prev.filter((_, i) => i !== index));
//   };

//   const viewPdf = (file: MedicalReport) => {
//     setSelectedFile(file);
//     setShowPdfViewer(true);
    
//     // Mark report as viewed if it's in PROCESSING status
//     if (file.status === "PROCESSING") {
//       updateReportStatus(file.id, "VIEWED");
//     }
//   };

//   const updateReportStatus = async (reportId: string, status: string) => {
//     try {
//       const response = await fetch(`/api/tests/results/${reportId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status }),
//       });
      
//       if (!response.ok) {
//         const data = await response.json();
//         throw new Error(data.error || 'Failed to update report status');
//       }
      
//       // Update local state if main report
//       if (mainReport && mainReport.id === reportId) {
//         setMainReport({...mainReport, status});
//       }
      
//       // Update in related reports if needed
//       setRelatedReports(prev =>
//         prev.map(report =>
//           report.id === reportId ? {...report, status} : report
//         )
//       );
      
//     } catch (error) {
//       console.error('Error updating report status:', error);
//     }
//   };

//   const closePdfViewer = () => {
//     setShowPdfViewer(false);
//     setSelectedFile(null);
//   };

//   // Helper function to format dates
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Function to get status badge color based on status
//   const getStatusBadgeColor = (status: string) => {
//     switch (status) {
//       case 'PROCESSING':
//         return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'VIEWED':
//         return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'COMPLETED':
//         return 'bg-green-100 text-green-800 border-green-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   return (
//     <>
//       {/* Step Indicator */}
//       <div className="bg-white shadow-sm p-4 border-t border-gray-100">
//         <div className="flex justify-between">
//           {["Patient Details", "Order Tests", "Review Results", "Prescribe Medicine"].map((step, index) => (
//             <div key={index} className="flex flex-col items-center">
//               <div
//                 className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${consultationStep > index + 1
//                     ? "bg-green-500 text-white"
//                     : consultationStep === index + 1
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-200 text-gray-600"
//                   }`}
//               >
//                 {consultationStep > index + 1 ? <CheckCircle size={16} /> : index + 1}
//               </div>
//               <div className="mt-1 text-xs font-medium text-gray-600">{step}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Step Content */}
//       <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
//         {/* Step 1: Patient Details */}
//         {consultationStep === 1 && (
//           <div className="fade-in">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="bg-white p-5 rounded-lg shadow-sm">
//                 <div className="flex items-center mb-4">
//                   <Clipboard className="text-blue-600 mr-2" size={18} />
//                   <h3 className="font-bold text-gray-800">Patient Symptoms</h3>
//                 </div>
//                 <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-4">
//                   <p className="text-gray-700">{patientSymptoms}</p>
//                 </div>

//                 <div className="flex items-center mb-4">
//                   <FileText className="text-blue-600 mr-2" size={18} />
//                   <h3 className="font-bold text-gray-800">Medical History</h3>
//                 </div>
//                 <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
//                   <p className="text-gray-700">{activePatient.medicalHistory}</p>
//                 </div>
//               </div>

//               <div className="bg-white p-5 rounded-lg shadow-sm">
//                 <div className="flex items-center mb-4">
//                   <Edit className="text-blue-600 mr-2" size={18} />
//                   <h3 className="font-bold text-gray-800">Patient Notes</h3>
//                 </div>
//                 <textarea
//                   className="w-full h-48 p-3 border border-gray-300 rounded-md"
//                   placeholder="Enter your notes about the patient here..."
//                   value={patientNotes}
//                   onChange={(e) => setPatientNotes(e.target.value)}
//                 />
//               </div>
//             </div>

//             <button
//               onClick={nextConsultationStep}
//               className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center"
//             >
//               Order Tests <ChevronRight size={18} className="ml-2" />
//             </button>
//           </div>
//         )}

//         {/* Step 2: Order Tests */}
//         {consultationStep === 2 && (
//           <div className="fade-in">
//             <div className="bg-white p-5 rounded-lg shadow-sm">
//               <h3 className="font-bold text-lg text-gray-800 mb-4">Recommended Tests</h3>
              
//               <div className="grid gap-3 md:grid-cols-3 mb-4">
//                 <input
//                   className="border p-2 rounded"
//                   placeholder="Test name"
//                   value={newTest.testName}
//                   onChange={(e) =>
//                     setNewTest({ ...newTest, testName: e.target.value })
//                   }
//                 />
//                 <input
//                   className="border p-2 rounded"
//                   placeholder="Test type"
//                   value={newTest.testType}
//                   onChange={(e) =>
//                     setNewTest({ ...newTest, testType: e.target.value })
//                   }
//                 />
//                 <input
//                   className="border p-2 rounded"
//                   placeholder="Description (optional)"
//                   value={newTest.description}
//                   onChange={(e) =>
//                     setNewTest({ ...newTest, description: e.target.value })
//                   }
//                 />
//               </div>
//               <button
//                 onClick={addTest}
//                 className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
//               >
//                 <Plus size={16} className="mr-1" /> Add Test
//               </button>

//               <ul className="mt-6 space-y-3">
//                 {recommendedTests.map((test, index) => (
//                   <li key={index} className="border p-3 rounded-md bg-blue-50 border-blue-100 flex justify-between items-start">
//                     <div>
//                       <p className="font-medium text-blue-700">{test.testName}</p>
//                       <p className="text-sm text-gray-600">Type: {test.testType}</p>
//                       {test.description && <p className="text-sm text-gray-600">{test.description}</p>}
//                     </div>
//                     <button
//                       onClick={() => removeTest(index)}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       <X size={18} />
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <button
//               onClick={nextConsultationStep}
//               disabled={isSubmittingTests}
//               className={`mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center ${isSubmittingTests ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
//             >
//               {isSubmittingTests ? 'Submitting...' : 'Review Test Results'} <ChevronRight size={18} className="ml-2" />
//             </button>
//           </div>
//         )}

//         {/* Step 3: Review Results */}
//         {consultationStep === 3 && (
//           <div className="fade-in">
//             {isLoadingReport ? (
//               <div className="flex justify-center items-center h-40">
//                 <div className="text-center">
//                   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
//                   <p className="mt-4 text-gray-600">Loading medical report...</p>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 {mainReport ? (
//                   <div className="mb-6 bg-white p-5 rounded-lg shadow-sm">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="font-bold text-xl text-gray-800">{mainReport.name}</h3>
//                         <div className="mt-2 flex flex-wrap gap-3">
//                           <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(mainReport.status)}`}>
//                             Status: {mainReport.status}
//                           </span>
//                           <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
//                             Type: {mainReport.type}
//                           </span>
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => viewPdf(mainReport)}
//                         className="bg-blue-100 text-blue-600 py-2 px-4 rounded hover:bg-blue-200 flex items-center transition"
//                       >
//                         <Eye size={16} className="mr-1" /> View PDF
//                       </button>
//                     </div>
                    
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                       <div>
//                         <div className="flex items-center text-gray-600 mb-2">
//                           <Calendar size={16} className="mr-2" />
//                           <span className="text-sm">Date: {formatDate(mainReport.date)}</span>
//                         </div>
                        
//                         <div className="flex items-center text-gray-600 mb-2">
//                           <User size={16} className="mr-2" />
//                           <span className="text-sm">Patient: {mainReport.patientName}</span>
//                         </div>
                        
//                         <div className="flex items-center text-gray-600">
//                           <User size={16} className="mr-2" />
//                           <span className="text-sm">Doctor: {mainReport.doctorName}</span>
//                         </div>
//                       </div>
                      
//                       <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
//                         <h4 className="font-medium text-gray-800 mb-2">Result Summary</h4>
//                         <p className="text-gray-700 whitespace-pre-wrap">{mainReport.results || "No result summary available."}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="mb-6 bg-white p-5 rounded-lg shadow-sm">
//                     <p className="text-gray-500 text-center py-4">No medical report found.</p>
//                   </div>
//                 )}

//                 {/* Related Reports */}
//                 {relatedReports.length > 0 && (
//                   <div className="mb-6 bg-white p-5 rounded-lg shadow-sm">
//                     <h3 className="font-bold text-lg text-gray-800 mb-4">Related Reports</h3>
//                     <ul className="divide-y divide-gray-200">
//                       {relatedReports.map((report) => (
//                         <li key={report.id} className="py-3 flex justify-between items-center">
//                           <div>
//                             <p className="font-medium text-gray-800">{report.name}</p>
//                             <div className="flex items-center gap-2 mt-1">
//                               <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(report.status)}`}>
//                                 {report.status}
//                               </span>
//                               <span className="text-xs text-gray-500">
//                                 {formatDate(report.date)}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => viewPdf(report)}
//                               className="p-2 text-blue-600 hover:bg-blue-50 rounded-md flex items-center"
//                               title="View"
//                             >
//                               <Eye size={18} />
//                             </button>
//                             <a
//                               href={report.fileUrl}
//                               download
//                               className="p-2 text-green-600 hover:bg-green-50 rounded-md flex items-center"
//                               title="Download"
//                             >
//                               <Download size={18} />
//                             </a>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {/* Test Results Section */}
//                 {testResults && (
//                   <div className="bg-white p-5 rounded-lg shadow-sm">
//                     <h3 className="font-bold text-lg text-gray-800 mb-4">Test Results</h3>
//                     <div className="bg-blue-50 p-4 rounded-md border border-blue-100 whitespace-pre-wrap">
//                       <p className="text-gray-700">{testResults}</p>
//                     </div>
//                   </div>
//                 )}

//                 {/* PDF Viewer Modal */}
//                 {showPdfViewer && selectedFile && (
//                   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
//                     <div className="bg-white rounded-lg w-full max-w-5xl h-5/6 flex flex-col">
//                       <div className="p-4 border-b flex justify-between items-center">
//                         <div>
//                           <h3 className="font-medium">{selectedFile.name}</h3>
//                           <p className="text-sm text-gray-500">
//                             {formatDate(selectedFile.date)} • {selectedFile.type}
//                           </p>
//                         </div>
//                         <button onClick={closePdfViewer} className="text-gray-500 hover:text-gray-800">
//                           <X size={24} />
//                         </button>
//                       </div>
//                       <div className="flex-1 p-2 overflow-hidden">
//                         <iframe
//                           src={selectedFile.fileUrl}
//                           className="w-full h-full border-0"
//                           title={selectedFile.name}
//                         />
//                       </div>
//                       <div className="p-3 border-t flex justify-between items-center">
//                         <div className="flex items-center">
//                           <CheckSquare size={16} className="text-green-600 mr-1" />
//                           <span className="text-sm text-gray-600">Report status: {selectedFile.status}</span>
//                         </div>
//                         <a
//                           href={selectedFile.fileUrl}
//                           download
//                           className="py-2 px-4 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center"
//                         >
//                           <Download size={16} className="mr-1" /> Download
//                         </a>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <button
//                   onClick={nextConsultationStep}
//                   className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center hover:bg-blue-700"
//                 >
//                   Prescribe Medication <ChevronRight size={18} className="ml-2" />
//                 </button>
//               </>
//             )}
//           </div>
//         )}

//         {/* Step 4: Prescribe Medication */}
//         {consultationStep === 4 && (
//           <div className="fade-in">
//             <div className="bg-white p-5 rounded-lg shadow-sm">
//               <h3 className="font-bold text-lg text-gray-800 mb-4">Prescriptions</h3>

//               <div className="grid gap-3 md:grid-cols-3 mb-3">
//                 <input
//                   className="border p-2 rounded"
//                   placeholder="Medication name"
//                   value={newMedication.name}
//                   onChange={(e) =>
//                     setNewMedication({ ...newMedication, name: e.target.value })
//                   }
//                 />
//                 <input
//                   className="border p-2 rounded"
//                   placeholder="Dosage (e.g., 500mg)"
//                   value={newMedication.dosage}
//                   onChange={(e) =>
//                     setNewMedication({ ...newMedication, dosage: e.target.value })
//                   }
//                 />
//                 <input
//                   className="border p-2 rounded"
//                   placeholder="Frequency (e.g., twice daily)"
//                   value={newMedication.frequency || ""}
//                   onChange={(e) =>
//                     setNewMedication({ ...newMedication, frequency: e.target.value })
//                   }
//                 />
//               </div>
              
//               <div className="grid gap-3 md:grid-cols-2 mb-3">
//                 <input
//                   className="border p-2 rounded"
//                   placeholder="Duration (e.g., 7 days)"
//                   value={newMedication.duration || ""}
//                   onChange={(e) =>
//                     setNewMedication({ ...newMedication, duration: e.target.value })
//                   }
//                 />
//                 <input
//                   className="border p-2 rounded"
//                   placeholder="Special instructions"
//                   value={newMedication.instructions}
//                   onChange={(e) =>
//                     setNewMedication({ ...newMedication, instructions: e.target.value })
//                   }
//                 />
//               </div>
              
//               <button
//                 onClick={addMedication}
//                 className="mt-3 text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
//               >
//                 <Plus size={16} className="mr-1" /> Add Medication
//               </button>

//               <ul className="mt-6 space-y-2">
//                 {medications.map((med, index) => (
//                   <li key={index} className="p-3 bg-blue-50 border border-blue-100 rounded flex justify-between items-start">
//                     <div>
//                       <p className="font-medium text-blue-700">{med.name}</p>
//                       <p className="text-sm text-gray-600">{med.dosage} {med.frequency ? `- ${med.frequency}` : ""}</p>
//                       {med.duration && <p className="text-sm text-gray-600">Duration: {med.duration}</p>}
//                       <p className="text-sm text-gray-600">Instructions: {med.instructions}</p>
//                     </div>
//                     <button
//                       onClick={() => removeMedication(index)}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       <X size={18} />
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <button
//               onClick={submitMedications}
//               disabled={isSubmittingMedications || medications.length === 0}
//               className={`mt-6 bg-green-600 text-white px-6 py-3 rounded-lg flex items-center ${
//                 (isSubmittingMedications || medications.length === 0) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'
//               }`}
//             >
//               {isSubmittingMedications ? 'Submitting...' : 'Complete & Submit Prescription'} <ArrowRight size={18} className="ml-2" />
//             </button>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default ConsultationWorkflow;


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
      const response = await fetch(`/api/appointments/details/${appointmentId}`);
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
      const response = await fetch(`/api/tests/results/${appointmentId}`);
      const data = await response.json();
      
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