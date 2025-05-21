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
  const [pastMedicalHistory, setPastMedicalHistory] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataExists, setDataExists] = useState(false);

  // Fetch existing data and auto-continue if it exists
  useEffect(() => {
    const fetchMedicalDetails = async () => {
      if (!appointmentId) return;

      try {
        const response = await axios.get(`/api/appointments/medicalDetails/${appointmentId}`);
        const data = response.data;

        if (data?.symptoms) {
          setSymptoms(data.symptoms.split(",").map((s: string) => s.trim()));
          setDataExists(true);
        }

        if (data?.notes) setNotes(data.notes);
        if (data?.pastMedicalHistory) setPastMedicalHistory(data.pastMedicalHistory);

        // Auto-continue if all essential fields exist
        if (data?.symptoms && data?.notes && data?.pastMedicalHistory) {
          setTimeout(() => {
            nextStep();
          }, 800); // slight delay for UX
        }
      } catch (error) {
        console.error("Error fetching medical details:", error);
      }
    };

    fetchMedicalDetails();
  }, [appointmentId, nextStep]);

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
    if (!appointmentId) return toast.error("Missing appointment ID");
    if (symptoms.length === 0) return toast.error("Please add at least one symptom");

    if (dataExists) {
      nextStep();
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/appointments/medicalDetails", {
        appointmentId,
        symptoms: symptoms.join(", "),
        notes,
        pastMedicalHistory,
        medicalFileUrl: "", // future use
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
    <div className="animate-fadeIn space-y-8">
      {/* SYMPTOMS */}
      <section className="bg-white shadow-sm p-6 rounded-xl border border-gray-200">
        <div className="flex items-center mb-4">
          <ClipboardList className="text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Symptoms</h2>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            id="symptom"
            placeholder="Add symptom..."
            className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {symptoms.map((symptom, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
            >
              {symptom}
              <button
                onClick={() => handleRemoveSymptom(symptom)}
                className="ml-2 text-blue-500 hover:text-red-500"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {symptoms.length === 0 && (
          <p className="text-sm text-gray-400 italic mt-2">No symptoms added yet.</p>
        )}
      </section>

      {/* PAST HISTORY */}
      <section className="bg-white shadow-sm p-6 rounded-xl border border-gray-200">
        <div className="flex items-center mb-4">
          <FileText className="text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Past Medical History</h2>
        </div>
        <textarea
          placeholder="Mention previous surgeries, illnesses, or ongoing conditions..."
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          value={pastMedicalHistory}
          onChange={(e) => setPastMedicalHistory(e.target.value)}
        />
      </section>

      {/* NOTES */}
      <section className="bg-white shadow-sm p-6 rounded-xl border border-gray-200">
        <div className="flex items-center mb-4">
          <FileText className="text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Notes for the Doctor</h2>
        </div>
        <textarea
          placeholder="Any other important information for the doctor..."
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={5}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </section>

      {/* ACTION BUTTONS */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={prevStep}
          className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600 transition"
        >
          Back
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
        >
          {loading ? "Submitting..." : dataExists ? "Continue" : "Submit and Continue"}
          <ChevronRight size={18} className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Step2_Medical;
