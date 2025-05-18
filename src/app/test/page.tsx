"use client"

import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  FileText,
  Activity,
  Pill,
  Plus,
  Stethoscope,
  AlertTriangle,
  ChevronRight,
  Loader2,
  PieChart,
  Sparkles
} from 'lucide-react';

// Sample data fetching function - replace with actual API calls
const fetchPatientAppointments = async (patientId) => {
  // This would be your actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "appt-1",
          date: new Date(2025, 4, 15),
          time: "10:00 AM",
          doctor: "Dr. Sarah Johnson",
          department: "Cardiology",
          type: "Follow-up",
          status: "COMPLETED",
        },
        {
          id: "appt-2", 
          date: new Date(2025, 4, 17),
          time: "2:30 PM",
          doctor: "Dr. Michael Chen",
          department: "Neurology",
          type: "Consultation",
          status: "CONFIRMED",
        },
        {
          id: "appt-3",
          date: new Date(2025, 4, 10),
          time: "9:15 AM",
          doctor: "Dr. Emily Wilson",
          department: "Internal Medicine",
          type: "Checkup",
          status: "COMPLETED",
        }
      ]);
    }, 500);
  });
};

// AI Report generation function
const generateAIReport = async (appointmentId) => {
  // This would be your actual API call to generate an AI report
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        symptoms: [
          { symptom: "Persistent headache", severity: "MODERATE", duration: "2 weeks" },
          { symptom: "Fatigue", severity: "MILD", duration: "3 weeks" },
          { symptom: "Shortness of breath on exertion", severity: "MODERATE", duration: "1 week" }
        ],
        medications: [
          { name: "Amlopidine", dosage: "5mg", frequency: "Once daily", instructions: "Take with food" },
          { name: "Metoprolol", dosage: "25mg", frequency: "Twice daily", instructions: "Take after meals" }
        ],
        vitals: {
          bloodPressure: "128/82",
          heartRate: 76,
          temperature: 36.8,
          oxygenSaturation: 98
        },
        testResults: [
          { name: "Complete Blood Count", status: "READY", type: "BLOOD_TEST" },
          { name: "Chest X-Ray", status: "READY", type: "X_RAY" }
        ],
        aiRecommendations: {
          possibleConditions: "Hypertension (primary), Anxiety disorder",
          urgencyLevel: "MODERATE",
          recommendedTests: "Echocardiogram, Stress Test",
          lifestyle: "Reduce sodium intake, Regular moderate exercise (30min/day), Stress management techniques",
          followUp: "Schedule follow-up in 2 weeks to reassess blood pressure"
        }
      });
    }, 1500);
  });
};

export default function PatientAIReportAnalyzer() {
  const [patientId, setPatientId] = useState("patient-123"); // Would be retrieved from auth context
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [aiReport, setAIReport] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    // Load patient appointments
    const loadAppointments = async () => {
      setLoading(true);
      try {
        const data = await fetchPatientAppointments(patientId);
        setAppointments(data);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [patientId]);

  const handleAppointmentSelect = async (appointment) => {
    setSelectedAppointment(appointment);
    setAIReport(null);
    setGeneratingReport(true);
    
    try {
      const report = await generateAIReport(appointment.id);
      setAIReport(report);
    } catch (error) {
      console.error("Failed to generate AI report:", error);
    } finally {
      setGeneratingReport(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'MILD': return 'bg-blue-100 text-blue-800';
      case 'MODERATE': return 'bg-yellow-100 text-yellow-800';
      case 'SEVERE': return 'bg-orange-100 text-orange-800';
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get urgency level color
  const getUrgencyColor = (level) => {
    switch(level) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MODERATE': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'EMERGENCY': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center mb-8">
        <Sparkles className="h-8 w-8 text-blue-500 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800">AI Health Report Analyzer</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointment List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-500" />
            Your Appointments
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No appointments found</p>
              ) : (
                appointments.map((appointment) => (
                  <div 
                    key={appointment.id}
                    onClick={() => handleAppointmentSelect(appointment)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedAppointment?.id === appointment.id 
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{appointment.doctor}</p>
                        <p className="text-sm text-gray-600">{appointment.department}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    
                    <div className="mt-3 flex items-center text-gray-600 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(appointment.date)}</span>
                      <Clock className="h-4 w-4 ml-3 mr-1" />
                      <span>{appointment.time}</span>
                    </div>
                    
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm text-gray-500">{appointment.type}</span>
                      <button className="text-blue-500 hover:text-blue-700 text-sm flex items-center">
                        AI Analysis <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        
        {/* AI Report Display */}
        <div className="lg:col-span-2">
          {!selectedAppointment ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Stethoscope className="h-16 w-16 text-blue-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">Select an appointment</h3>
              <p className="text-gray-500">Choose an appointment from the list to generate an AI health report</p>
            </div>
          ) : generatingReport ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                <h3 className="text-xl font-medium text-gray-700">Generating AI Report</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Our AI is analyzing your medical data to create a comprehensive health report...
                </p>
              </div>
            </div>
          ) : aiReport ? (
            <div className="bg-white rounded-lg shadow-md">
              {/* Report Header */}
              <div className="border-b border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <Sparkles className="h-5 w-5 text-blue-500 mr-2" />
                      <h2 className="text-xl font-semibold text-gray-800">AI Health Report</h2>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      For appointment with {selectedAppointment.doctor} on {formatDate(selectedAppointment.date)}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium flex items-center">
                    <PieChart className="h-3.5 w-3.5 mr-1" />
                    AI Generated
                  </span>
                </div>
              </div>
              
              {/* Report Content */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Symptoms Section */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                    <Activity className="h-5 w-5 text-red-500 mr-2" />
                    Reported Symptoms
                  </h3>
                  <ul className="space-y-2">
                    {aiReport.symptoms.map((symptom, index) => (
                      <li key={index} className="border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                        <div className="flex justify-between">
                          <span className="text-gray-800">{symptom.symptom}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(symptom.severity)}`}>
                            {symptom.severity}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">Duration: {symptom.duration}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Vitals Section */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                    <Activity className="h-5 w-5 text-green-500 mr-2" />
                    Vital Signs
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-500">Blood Pressure</div>
                      <div className="text-lg font-medium text-gray-800">{aiReport.vitals.bloodPressure}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-500">Heart Rate</div>
                      <div className="text-lg font-medium text-gray-800">{aiReport.vitals.heartRate} bpm</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-500">Temperature</div>
                      <div className="text-lg font-medium text-gray-800">{aiReport.vitals.temperature}°C</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-500">Oxygen Saturation</div>
                      <div className="text-lg font-medium text-gray-800">{aiReport.vitals.oxygenSaturation}%</div>
                    </div>
                  </div>
                </div>
                
                {/* Medications Section */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                    <Pill className="h-5 w-5 text-purple-500 mr-2" />
                    Current Medications
                  </h3>
                  <ul className="space-y-3">
                    {aiReport.medications.map((med, index) => (
                      <li key={index} className="border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                        <div className="font-medium text-gray-800">{med.name} - {med.dosage}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {med.frequency} • {med.instructions}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Test Results Section */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                    <FileText className="h-5 w-5 text-blue-500 mr-2" />
                    Test Results
                  </h3>
                  <ul className="space-y-2">
                    {aiReport.testResults.map((test, index) => (
                      <li key={index} className="flex justify-between items-center py-1">
                        <div>
                          <span className="text-gray-800">{test.name}</span>
                          <div className="text-xs text-gray-500">{test.type.replace('_', ' ')}</div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          test.status === 'READY' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {test.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* AI Recommendations */}
              <div className="bg-blue-50 p-6 rounded-b-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 text-blue-500 mr-2" />
                  AI Health Recommendations
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Possible Conditions</h4>
                      <p className="text-gray-800">{aiReport.aiRecommendations.possibleConditions}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Recommended Tests</h4>
                      <p className="text-gray-800">{aiReport.aiRecommendations.recommendedTests}</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Urgency Level</h4>
                      <span className={`px-3 py-1 rounded-full text-sm ${getUrgencyColor(aiReport.aiRecommendations.urgencyLevel)}`}>
                        {aiReport.aiRecommendations.urgencyLevel}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Follow-up Recommendation</h4>
                      <p className="text-gray-800">{aiReport.aiRecommendations.followUp}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Lifestyle Recommendations</h4>
                  <p className="text-gray-800">{aiReport.aiRecommendations.lifestyle}</p>
                </div>
                
                <div className="mt-6 flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                  <p className="text-sm text-yellow-700">
                    This AI report is provided for informational purposes only and should not replace professional medical advice. 
                    Always consult with your healthcare provider.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}