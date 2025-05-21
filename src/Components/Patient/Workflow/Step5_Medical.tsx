/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState,  ReactNode, Key } from "react";
import axios from "axios";
import { Pill, CalendarCheck, UserCheck, MapPin, ClipboardList } from "lucide-react";
import Link from "next/link";

const Step5 = ({ appointmentId, prevStep }: { appointmentId: string; prevStep: () => void }) => {
  const [appointment, setAppointment] = useState<any>(null);

  useEffect(() => {
    const fetchMedicalDetails = async () => {
      if (!appointmentId) return;

      try {
        const response = await axios.post(`/api/appointments`, { appointmentId });

        setAppointment(response.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching medical details:", error);
      }
    };

    fetchMedicalDetails();
  }, [appointmentId]);

  if (!appointment) {
    return <p className="text-center text-gray-500">Loading appointment details...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-extrabold text-gray-800">Consultation Summary</h2>
        <p className="text-gray-500 mt-2">Review your diagnosis, tests, and prescribed medications below.</p>
      </div>

      {/* Summary Section */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-200 space-y-4">
        <div className="flex items-center gap-3">
          <CalendarCheck className="text-blue-600" />
          <p><strong>Date:</strong> {appointment?.appointmentDate} &nbsp; | &nbsp;<strong>Time:</strong> {appointment?.appointmentTime}</p>
        </div>
        <div className="flex items-center gap-3">
          <UserCheck className="text-green-600" />
          <p><strong>Doctor:</strong> {appointment?.doctorName} ({appointment?.doctorSpecialty})</p>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="text-purple-600" />
          <p><strong>Location:</strong> {appointment?.location}</p>
        </div>
        <div className="flex items-center gap-3">
          <ClipboardList className="text-gray-600" />
          <p><strong>Notes:</strong> {appointment?.notes}</p>
        </div>
      </div>

      {/* Medications Section */}
      <div className="mb-10">
        <div className="flex items-center mb-4">
          <Pill className="text-emerald-600 mr-2" size={24} />
          <h2 className="text-2xl font-semibold text-gray-800">Prescribed Medications</h2>
        </div>

        <div className="space-y-4">
          {appointment.medications && appointment.medications.length > 0 ? (
            appointment.medications.map(
              (
                med: {
                  name: ReactNode;
                  dosage: ReactNode;
                  instructions: ReactNode;
                },
                index: Key
              ) => (
                <div key={index} className="bg-white shadow-sm border-l-4 border-green-500 rounded-lg p-5">
                  <h4 className="font-bold text-lg text-gray-900">{med.name}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-gray-500">Dosage</p>
                      <p className="font-medium text-gray-700">{med.dosage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Instructions</p>
                      <p className="font-medium text-gray-700">{med.instructions}</p>
                    </div>
                  </div>
                </div>
              )
            )
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="mb-3 text-gray-400">
                <Pill size={32} className="mx-auto" />
              </div>
              <p className="text-gray-600">No medications have been prescribed yet.</p>
              <p className="text-sm text-gray-500 mt-1">The doctor may prescribe medication after full analysis.</p>
            </div>
          )}
        </div>
      </div>

      {/* Thank You Section */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl border border-gray-200 shadow-sm mb-10 text-center">
        <h3 className="text-2xl font-bold text-green-700 mb-2">Thank You for Consulting with Us!</h3>
        <p className="text-gray-700 text-md">
          We appreciate your trust in MedicoHub. Stay healthy and feel free to revisit us anytime. You can find all your medical history in the Medical History section.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={prevStep}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          Back
        </button>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={"/patient/appointment"}>
          
          <button
            
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Appointments
          </button>
          </Link>
          {appointment.status === "scheduled" && (
            <button
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Cancel Appointment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step5;
