import React from "react";
import { Clipboard, FileText, Edit, ChevronRight } from "lucide-react";

type PatientDetailsStepProps = {
  patientSymptoms: string;
  patientMedicalHistory: string;
  patientNotes: string;
  setPatientNotes: (notes: string) => void;
  onNext: () => void;
};

const PatientDetailsStep: React.FC<PatientDetailsStepProps> = ({
  patientSymptoms,
  patientMedicalHistory,
  patientNotes,
  setPatientNotes,
  onNext
}) => {
  return (
    <div className="fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <Clipboard className="text-blue-600 mr-2" size={18} />
            <h3 className="font-bold text-gray-800">Patient Symptoms</h3>
          </div>
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-4">
            <p className="text-gray-700">{patientSymptoms}</p>
          </div>

          <div className="flex items-center mb-4">
            <FileText className="text-blue-600 mr-2" size={18} />
            <h3 className="font-bold text-gray-800">Medical History</h3>
          </div>
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <p className="text-gray-700">{patientMedicalHistory}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <Edit className="text-blue-600 mr-2" size={18} />
            <h3 className="font-bold text-gray-800">Patient Notes</h3>
          </div>
          <textarea
            className="w-full h-48 p-3 border border-gray-300 rounded-md"
            placeholder="Enter your notes about the patient here..."
            value={patientNotes}
            onChange={(e) => setPatientNotes(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={onNext}
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center"
      >
        Order Tests <ChevronRight size={18} className="ml-2" />
      </button>
    </div>
  );
};

export default PatientDetailsStep;