"use client";
import { ClipboardList, FileText, ChevronRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";

type Step2Props = {
  nextStep: () => void;
  prevStep: () => void;
};

const Step2_Medical: React.FC<Step2Props> = ({ nextStep, prevStep }) => {
  const params = useParams();
  const appointmentId = params?.AppointmentId as string;

  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch existing symptoms and notes from the database
  useEffect(() => {
    const fetchMedicalDetails = async () => {
      if (!appointmentId) return;

      try {
        const response = await axios.get(`/api/appointments/medicalDetails/${appointmentId}`);
        const data = response.data;

        if (data?.symptoms) {
          setSymptoms(data.symptoms.split(",").map((s: string) => s.trim()));
        }

        if (data?.notes) {
          setNotes(data.notes);
        }
      } catch (error) {
        console.error("Error fetching medical details:", error);
      }
    };

    fetchMedicalDetails();
  }, [appointmentId]);

  const handleAddSymptom = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !symptoms.includes(trimmed)) {
      setSymptoms([...symptoms, trimmed]);
    }
  };

  const handleRemoveSymptom = (symptomToRemove: string) => {
    setSymptoms(symptoms.filter((symptom) => symptom !== symptomToRemove));
  };

  const handleSubmit = async () => {
    if (!appointmentId) {
      toast.error("Missing appointment ID");
      return;
    }

    if (symptoms.length === 0) {
      toast.error("Please add at least one symptom");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/appointments/medicalDetails", {
        appointmentId,
        symptoms: symptoms.join(", "), // store as comma-separated string
        notes,
        medicalFileUrl: "", // placeholder for future file uploads
      });

      toast.success("Medical details submitted");
      nextStep();
    } catch (err) {
      console.error(err);
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <ClipboardList className="text-blue-600 mr-2" size={24} />
          <h2 className="text-xl font-bold text-gray-800">Your Symptoms</h2>
        </div>

        <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-100 mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Add your symptom</label>
            <div className="flex">
              <input
                type="text"
                id="symptom"
                placeholder="Enter symptom..."
                className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSymptom((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = "";
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.getElementById("symptom") as HTMLInputElement;
                  handleAddSymptom(input.value);
                  input.value = "";
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-gray-700 mb-2">Current symptoms:</p>
            {symptoms.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {symptoms.map((symptom, index) => (
                  <div
                    key={index}
                    className="bg-white border border-yellow-200 rounded-full px-3 py-1 flex items-center"
                  >
                    <span className="text-gray-700">{symptom}</span>
                    <button
                      onClick={() => handleRemoveSymptom(symptom)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No symptoms added yet</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <FileText className="text-blue-600 mr-2" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Notes for the Doctor</h2>
          </div>

          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
            placeholder="Provide any additional information that might be helpful for your doctor..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
        >
          Back
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
        >
          {loading ? "Submitting..." : "Continue"} <ChevronRight size={18} className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Step2_Medical;
