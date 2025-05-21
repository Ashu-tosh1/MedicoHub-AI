/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Calendar, Stethoscope, User, MapPin, ChevronRight } from 'lucide-react';
import Step1_Medical from "./Step1_Medical";
import Step2_Medical from "./Step2_Medical";
import Step3TestRecommendation from "./Step3_Medical";
import TestReportUpload from "./Step4_Medical";
import Step5 from "./Step5_Medical";
import PatientSidebar from "../PatientSidebar";

// Define our types
type AppointmentDetails = {
  id: string;
  patientName: string;
  doctorName: string;
  doctorSpecialty: string;
  appointmentDate: string;
  appointmentTime: string;
  location: string;
  status: string;
  symptoms?: string[];
  recommendedTests?: TestType[];
  testResults?: string;
  medications?: Medication[];
  patientId: string;
  doctorId: string;
};

type TestType = {
  name: string;
  description: string;
};

type Medication = {
  name: string;
  dosage: string;
  instructions: string;
};

const AppointmentDetails = () => {
  const params = useParams();
  const appointmentId = params?.AppointmentId as string;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [appointment, setAppointment] = useState<AppointmentDetails | null>(null);
  
  // Add state to control steps
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Function to go to next step
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  // Function to go to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Fetch appointment data
  useEffect(() => {
    const fetchAppointmentData = async () => {
      if (!appointmentId) {
        setError("No appointment ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
       
        const response = await fetch(`/api/appointments/patient/${appointmentId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch appointment data");
        }
        
        const data = await response.json();
        console.log(data)
        setAppointment(data);
      } catch (err) {
        setError("Error fetching appointment details. Using mock data instead.");
        
        // Fallback to mock data for demonstration
        setAppointment({
          id: appointmentId || "AP12345",
          patientId: "124",
          doctorId: "234",
          patientName: "John Doe",
          doctorName: "Dr. Emily Smith",
          doctorSpecialty: "Cardiologist",
          appointmentDate: "May 10, 2025",
          appointmentTime: "10:30 AM",
          location: "Medical Center, Room 305",
          status: "scheduled",
          symptoms: ["Chest pain", "Shortness of breath", "Fatigue"],
          recommendedTests: [
            { name: "Complete Blood Count", description: "Basic blood test to check overall health" },
            { name: "Liver Function Test", description: "To check liver health and function" },
            { name: "Lipid Profile", description: "To measure cholesterol levels and other fats in the blood" }
          ],
          testResults: "Blood glucose: 110 mg/dL\nHemoglobin: 14.5 g/dL\nWBC: 7,500/mcL\nPlatelets: 250,000/mcL\nLDL Cholesterol: 130 mg/dL\nHDL Cholesterol: 45 mg/dL\nTriglycerides: 150 mg/dL",
          medications: [
            { name: "Amoxicillin", dosage: "500mg", instructions: "Take 3 times daily after meals for 7 days" },
            { name: "Paracetamol", dosage: "650mg", instructions: "Take when needed for fever or pain, max 4 tablets per day" },
            { name: "Vitamin D", dosage: "1000 IU", instructions: "Take once daily with food" }
          ]
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointmentData();
  }, [appointmentId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <span className="text-lg font-medium text-gray-700">Loading appointment details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-xl text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Go Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return null;
  }

  // Step 1: Welcome screen
  const renderStep1 = () => {
    return (
      <div>
        <Step1_Medical nextStep={nextStep} appointmentId={appointmentId} />
      </div>
    );
  };

  // Step 2: Symptoms and notes
  const renderStep2 = () => {
    return (
      <div>
        <Step2_Medical nextStep={nextStep} prevStep={prevStep} />
      </div>
    );
  };

  // Step 3: Recommended Tests
  const renderStep3 = () => {
    return (
      <div>
        <Step3TestRecommendation nextStep={nextStep} prevStep={prevStep} appointment={appointment} />
      </div>
    );
  };

  // Step 4: Upload Test Results
  const renderStep4 = () => {
    return (
      <div>
        <TestReportUpload
          appointment={appointment}
          prevStep={prevStep}
          nextStep={nextStep}
        />
      </div>
    );
  };

  // Step 5: Medications
  const renderStep5 = () => {
    return (
      <div>
        <Step5 appointmentId={appointmentId} prevStep={prevStep} />
      </div>
    );
  };

  // Render content based on current step
  const renderContent = () => {
    switch(currentStep) {
      case 0:
        return renderStep1();
      case 1:
        return renderStep2();
      case 2:
        return renderStep3();
      case 3:
        return renderStep4();
      case 4:
        return renderStep5();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex">
      {/* Sidebar space - you can import your sidebar component here */}
      <div className="w-64 bg-white shadow-lg">
        {/* This is where you will import your sidebar component */}
        <PatientSidebar/>
      </div>
      
      {/* Main content */}
      <div className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Appointment #{appointment.id}</h2>
                <div className="mt-1 text-blue-100 flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>{appointment.appointmentDate} • {appointment.appointmentTime}</span>
                </div>
              </div>
              <div className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {/* Step indicator - fixed alignment */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex-1 flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>1</div>
                  <div className={`flex-1 h-1 mx-2 ${currentStep >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>2</div>
                  <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>3</div>
                  <div className={`flex-1 h-1 mx-2 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>4</div>
                  <div className={`flex-1 h-1 mx-2 ${currentStep >= 4 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>5</div>
                </div>
                <div className="ml-4 text-sm text-gray-600">
                  Step {currentStep + 1} of 5
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 px-1">
                <span>Welcome</span>
                <span>Symptoms</span>
                <span>Tests</span>
                <span>Results</span>
                <span>Medications</span>
              </div>
            </div>
            
            {/* Render step content */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;