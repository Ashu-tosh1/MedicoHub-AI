import React, { useState } from "react";
import { ArrowRight, Plus, X } from "lucide-react";

type Medication = {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  };
type PrescribeMedicationStepProps = {
  medications: Medication[];
  setMedications: React.Dispatch<React.SetStateAction<Medication[]>>;
  isSubmittingMedications: boolean;
  onSubmit: () => void;
};

const PrescribeMedicationStep: React.FC<PrescribeMedicationStepProps> = ({
  medications,
  setMedications,
  isSubmittingMedications,
  onSubmit,
}) => {
  const [newMedication, setNewMedication] = useState<Medication>({
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
  });

  const addMedication = () => {
    if (newMedication.name.trim() === "" || newMedication.dosage.trim() === "") {
      alert("Medication name and dosage are required");
      return;
    }

    setMedications([...medications, { ...newMedication }]);
    setNewMedication({
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    });
  };

  const removeMedication = (index: number) => {
    const updatedMedications = [...medications];
    updatedMedications.splice(index, 1);
    setMedications(updatedMedications);
  };

  return (
    <div className="fade-in">
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <h3 className="font-bold text-lg text-gray-800 mb-4">Prescriptions</h3>

        <div className="grid gap-3 md:grid-cols-3 mb-3">
          <input
            className="border p-2 rounded"
            placeholder="Medication name"
            value={newMedication.name}
            onChange={(e) =>
              setNewMedication({ ...newMedication, name: e.target.value })
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="Dosage (e.g., 500mg)"
            value={newMedication.dosage}
            onChange={(e) =>
              setNewMedication({ ...newMedication, dosage: e.target.value })
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="Frequency (e.g., twice daily)"
            value={newMedication.frequency || ""}
            onChange={(e) =>
              setNewMedication({ ...newMedication, frequency: e.target.value })
            }
          />
        </div>
        
        <div className="grid gap-3 md:grid-cols-2 mb-3">
          <input
            className="border p-2 rounded"
            placeholder="Duration (e.g., 7 days)"
            value={newMedication.duration || ""}
            onChange={(e) =>
              setNewMedication({ ...newMedication, duration: e.target.value })
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="Special instructions"
            value={newMedication.instructions}
            onChange={(e) =>
              setNewMedication({ ...newMedication, instructions: e.target.value })
            }
          />
        </div>
        
        <button
          onClick={addMedication}
          className="mt-3 text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <Plus size={16} className="mr-1" /> Add Medication
        </button>

        <ul className="mt-6 space-y-2">
          {medications.map((med, index) => (
            <li key={index} className="p-3 bg-blue-50 border border-blue-100 rounded flex justify-between items-start">
              <div>
                <p className="font-medium text-blue-700">{med.name}</p>
                <p className="text-sm text-gray-600">{med.dosage} {med.frequency ? `- ${med.frequency}` : ""}</p>
                {med.duration && <p className="text-sm text-gray-600">Duration: {med.duration}</p>}
                <p className="text-sm text-gray-600">Instructions: {med.instructions}</p>
              </div>
              <button
                onClick={() => removeMedication(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={18} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onSubmit}
        disabled={isSubmittingMedications || medications.length === 0}
        className={`mt-6 bg-green-600 text-white px-6 py-3 rounded-lg flex items-center ${
          (isSubmittingMedications || medications.length === 0) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'
        }`}
      >
        {isSubmittingMedications ? 'Submitting...' : 'Complete & Submit Prescription'} <ArrowRight size={18} className="ml-2" />
      </button>
    </div>
  );
};

export default PrescribeMedicationStep;