import React, { useState } from "react";
import { Calendar, Search, Clock,User } from "lucide-react";

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


interface SidebarNavigationProps {
  patients: Patient[];
  activePatient: Patient | null;
  selectPatient: (patient: Patient) => void;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({patients,activePatient,selectPatient,}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStatusBadge = (status: Patient["status"]) => {
    switch (status) {
      case "waiting":
        return (
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
            Waiting
          </span>
        );
      case "in-progress":
        return (
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            In Progress
          </span>
        );
      case "completed":
        return (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-64 bg-white shadow-md h-full flex flex-col">
      {/* Header */}
      <div className="p-4 bg-blue-600 text-white">
        <div className="flex items-center">
          <User size={20} className="mr-2" />
          <h1 className="font-bold text-lg">PatientList</h1>
        </div>
        {/* <div className="mt-1 text-sm">
                  <p>{}</p>
          <p className="text-blue-200">Cardiologist</p>
        </div> */}
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search patients..."
            className="w-full pl-8 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={16} className="absolute left-2.5 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Patient List */}
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="flex items-center mb-3">
          <Calendar size={16} className="text-blue-600 mr-2" />
          <h2 className="font-medium text-gray-800 text-sm">Today&apos;s Appointments</h2>
        </div>

        {filteredPatients.length > 0 ? (
          <div className="space-y-2">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                role="button"
                tabIndex={0}
                onClick={() => selectPatient(patient)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") selectPatient(patient);
                }}
                className={`p-3 rounded-md cursor-pointer transition-all focus:outline-none ${
                  activePatient?.id === patient.id
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800">{patient.name}</h3>
                    <p className="text-xs text-gray-500">
                      {patient.age} yrs • {patient.gender}
                    </p>
                  </div>
                  <div className="flex flex-col items-end text-right">
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <Clock size={12} className="mr-1" />
                      {patient.appointmentTime}
                    </div>
                    {renderStatusBadge(patient.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-4 text-center">No patients found.</p>
        )}
      </div>
    </div>
  );
};

export default SidebarNavigation;
