import React from "react";
import { User } from "lucide-react";
import { Patient } from "./PatientList";
// import { Patient } from "./DoctorDashboard";



interface Props {
  activePatient: Patient;
  setIsChatOpen: (open: boolean) => void;
}

const PatientInfoDisplay:React.FC<Props > = ({ activePatient }) => {
  if (!activePatient) {
    return (
      <div className="bg-white p-4 border-b border-gray-200 text-gray-600 text-sm italic">
        No patient selected.
      </div>
    );
  }

  return (
    <div className="bg-white p-4 border-b border-gray-200">
      <div className="flex items-center">
        <div className="bg-blue-100 rounded-full p-2 mr-4">
          <User size={24} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{activePatient.name}</h2>
          <div className="flex text-sm text-gray-600">
            <span className="mr-3">{activePatient.age} years</span>
            <span className="mr-3">•</span>
            <span>{activePatient.gender}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoDisplay;
