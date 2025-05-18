/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import axios from "axios";
import { Pill, FileText } from "lucide-react";

const Step5 = ({ appointmentId, prevStep }: { appointmentId: string, prevStep: () => void }) => {
  const [appointment, setAppointment] = useState<any>(null);

  useEffect(() => {
    const fetchMedicalDetails = async () => {
      if (!appointmentId) return;

      try {
        const response = await axios.get(`/api/appointments/${appointmentId}`);
          setAppointment(response.data);
          console.log(response)
      } catch (error) {
        console.error("Error fetching medical details:", error);
      }
    };

    fetchMedicalDetails();
  }, [appointmentId]);

  if (!appointment) {
    return <p className="text-center text-gray-500">Loading appointment details...</p>;
  }

  const renderStep5 = () => {
    return (
      <div>
        {/* Summary Section */}
        <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Consultation Summary</h3>
          <p><strong>Date:</strong> {appointment?.appointmentDate}</p>
          <p><strong>Time:</strong> {appointment?.appointmentTime}</p>
          <p><strong>Doctor:</strong> {appointment?.doctorName} ({appointment?.doctorSpecialty})</p>
          <p><strong>Location:</strong> {appointment?.location}</p>
          {/* <p><strong>Symptoms:</strong> {appointment?.symptoms?.join(", ")}</p> */}
          <p><strong>Notes:</strong> {appointment?.notes}</p>
          <p><strong>Test Results:</strong> {appointment?.testResults}</p>
        </div>

        {/* Medications Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Pill className="text-blue-600 mr-2" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Prescribed Medications</h2>
          </div>
          
          <div className="space-y-4">
            {appointment.medications && appointment.medications.length > 0 ? (
              appointment.medications.map((med: { name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; dosage: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; instructions: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, index: Key | null | undefined) => (
                <div key={index} className="bg-white p-4 rounded-lg border-l-4 border-green-500 shadow-sm">
                  <h4 className="font-bold text-lg text-gray-800">{med.name}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
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
              ))
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="mb-3 text-gray-400">
                  <Pill size={32} className="mx-auto" />
                </div>
                <p className="text-gray-600">No medications have been prescribed yet.</p>
                <p className="text-sm text-gray-500 mt-1">The doctor will review your test results and symptoms before prescribing.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-between mt-6">
          <button 
            onClick={prevStep}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
          >
            Back
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={() => window.history.back()}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300 flex items-center"
            >
              Back to Appointments
            </button>
            
            {appointment.status === "scheduled" && (
              <button 
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Cancel Appointment
              </button>
            )}
            
            {appointment.medications && appointment.medications.length > 0 && (
              <button 
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 flex items-center"
              >
                Download Prescription <FileText size={18} className="ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return renderStep5();
};

export default Step5;
