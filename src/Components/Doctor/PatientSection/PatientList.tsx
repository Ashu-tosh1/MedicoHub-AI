/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
// import CommunicationTools from "./CommunicationTools";
import ConsultationWorkflow from "./WorkFlow";
import PatientInfoDisplay from "./PatientInfo";
import SidebarNavigation from "./SidebarNavigation";
// import DoctorSidebar from "@/app/(doctor)/sidebar/page";

// Type Definitions
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  appointmentTime: string;
  status: "waiting" | "in-progress" | "completed";
  symptoms: string;
  medicalHistory: string; 
  image?: string;
  appointmentId: string;
}


const PatientSection = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [consultationStep, setConsultationStep] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);
    
  // Fetch confirmed patients when the component mounts
  useEffect(() => {
    const fetchConfirmedPatients = async () => {
      try {
        const response = await fetch('/api/appointments/confirmed');
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error("Error fetching confirmed patients:", error);
      }
    };

    fetchConfirmedPatients();
  }, []);

  // Select patient & update status
  const selectPatient = (patient: Patient) => {
    setActivePatient(patient);
    setConsultationStep(1);
    updatePatientStatus(patient.id, "in-progress");
  };

  // Update patient status
  const updatePatientStatus = (patientId: string, newStatus: Patient["status"]) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, status: newStatus } : p))
    );
  };

  // Complete consultation
  const completeConsultation = () => {
    if (activePatient) {
      updatePatientStatus(activePatient.id, "completed");
      setActivePatient(null);
      setConsultationStep(1);
      setIsChatOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-100">
      {/* Main Sidebar */}
      {/* <aside className="w-64 bg-blue-200 hidden md:flex flex-col justify-between">
        <DoctorSidebar />
      </aside> */}

      {/* Patient Sidebar */}
      <aside className="w-64 bg-blue-50 mt-[50px] hidden md:block">
        <SidebarNavigation
          patients={patients}
          activePatient={activePatient}
          selectPatient={selectPatient}
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 mt-[50px] flex flex-col">
        {activePatient ? (
          <div className="flex flex-col h-full">
            {/* Patient Info Header */}
            <PatientInfoDisplay
              activePatient={activePatient}
              setIsChatOpen={setIsChatOpen}
            />

            {/* Step-by-step Consultation Workflow */}
            <ConsultationWorkflow
  activePatient={activePatient}
  consultationStep={consultationStep}
  setConsultationStep={setConsultationStep}
  completeConsultation={completeConsultation}
/>

          </div>
        ) : (
          // No Active Patient UI
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                No Active Consultation
              </h2>
              <p className="text-gray-600 mb-6">
                Select a patient from the sidebar to begin consultation
              </p>
              <button
                onClick={() => selectPatient(patients[0])}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg"
              >
                Start Next Appointment
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Optional: Communication Chat */}
      {/* {isChatOpen && activePatient && (
        <CommunicationTools
          activePatient={activePatient}
          setIsChatOpen={setIsChatOpen}
        /> */}
      {/* )} */}
    </div>
  );
};

export default PatientSection;

