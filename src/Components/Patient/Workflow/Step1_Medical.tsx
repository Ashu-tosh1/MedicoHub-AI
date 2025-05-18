/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { ChevronRight,  User, MapPin, Calendar, Stethoscope } from 'lucide-react'
import React, { useState, useEffect } from 'react'

interface Step1Props {
  nextStep: () => void;
  appointmentId: string;
}

const Step1_Medical: React.FC<Step1Props> = ({ nextStep, appointmentId }) => {
  const [appointment, setAppointment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setAppointment({
          id: appointmentId || "AP12345",
          patientName: "John Doe",
          doctorName: "Dr. Emily Smith",
          doctorSpecialty: "Cardiologist",
          appointmentDate: "May 10, 2025",
          appointmentTime: "10:30 AM",
          location: "Medical Center, Room 305",
          status: "scheduled",
          symptoms: ["Chest pain", "Shortness of breath", "Fatigue"],
          recommendedTests: [],
          testResults: "",
          medications: [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointmentData();
  }, [appointmentId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <span className="ml-3 text-gray-700">Loading appointment details...</span>
      </div>
    );
  }

  return (
    <div className="text-center">
    <div className="mb-6">
      <div className="bg-blue-100 rounded-full p-4 inline-block">
        <Calendar className="text-blue-600" size={32} />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-2">Welcome to Your Appointment</h2>
      <p className="text-gray-600">Please Upload the  following details for your consultation with {appointment.doctorName}</p>
    </div>
    
    <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 mb-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex items-start">
          <Calendar size={20} className="text-blue-600 mt-1 mr-2" />
          <div>
            <p className="text-sm text-gray-500">Date & Time</p>
            <p className="font-medium text-gray-800">{appointment.appointmentDate} • {appointment.appointmentTime}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Stethoscope size={20} className="text-blue-600 mt-1 mr-2" />
          <div>
            <p className="text-sm text-gray-500">Doctor</p>
            <p className="font-medium text-gray-800">{appointment.doctorName}</p>
            <p className="text-sm text-gray-500">{appointment.doctorSpecialty}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <User size={20} className="text-blue-600 mt-1 mr-2" />
          <div>
            <p className="text-sm text-gray-500">Patient</p>
            <p className="font-medium text-gray-800">{appointment.patientName}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <MapPin size={20} className="text-blue-600 mt-1 mr-2" />
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium text-gray-800">{appointment.location}</p>
          </div>
        </div>
      </div>
    </div>
    
    <button 
      onClick={nextStep}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center mx-auto"
    >
      Continue to Symptoms <ChevronRight size={18} className="ml-2" />
    </button>
  </div>
  );
};

export default Step1_Medical;
