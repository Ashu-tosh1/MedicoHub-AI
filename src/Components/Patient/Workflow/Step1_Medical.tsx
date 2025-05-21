/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { ChevronRight, User, MapPin, Calendar, Stethoscope } from 'lucide-react';
import React, { useState, useEffect } from 'react';

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
        const response = await fetch('/api/appointments/patient', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ appointmentId }),
        });
        
        if (!response.ok) throw new Error("Failed to fetch appointment data");

        const data = await response.json();
        console.log(data);
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
    <div className="max-w-3xl mx-auto px-6 py-10 bg-white shadow-2xl rounded-2xl border border-gray-100">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100">
          <Calendar className="text-blue-600" size={28} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mt-4">Your Appointment is Ready</h2>
        <p className="text-gray-600 mt-2">
          Please confirm and proceed with your consultation with <span className="font-semibold">{appointment.doctorName}</span>.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 text-left">
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-start gap-4">
          <Calendar size={22} className="text-blue-600 mt-1" />
          <div>
            <p className="text-sm text-gray-500">Date & Time</p>
            <p className="text-base font-semibold text-gray-800">{appointment.appointmentDate} • {appointment.appointmentTime}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-start gap-4">
          <Stethoscope size={22} className="text-blue-600 mt-1" />
          <div>
            <p className="text-sm text-gray-500">Doctor</p>
            <p className="text-base font-semibold text-gray-800">{appointment.doctorName}</p>
            <p className="text-sm text-gray-500">{appointment.doctorSpecialty}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-start gap-4">
          <User size={22} className="text-blue-600 mt-1" />
          <div>
            <p className="text-sm text-gray-500">Patient</p>
            <p className="text-base font-semibold text-gray-800">{appointment.patientName}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-start gap-4">
          <MapPin size={22} className="text-blue-600 mt-1" />
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="text-base font-semibold text-gray-800">{appointment.location}</p>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={nextStep}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition duration-300 inline-flex items-center"
        >
          Continue to Symptoms
          <ChevronRight size={20} className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Step1_Medical;
