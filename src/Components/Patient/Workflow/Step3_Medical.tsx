
"use client";

import React from "react";
import { Stethoscope, ChevronRight } from "lucide-react";

// Type definitions
type Test = {
  name: string;
  description: string;
};

type Appointment = {
  recommendedTests?: Test[];
};

interface Step3Props {
  appointment: Appointment;
  prevStep: () => void;
  nextStep: () => void;
}

const Step3TestRecommendation: React.FC<Step3Props> = ({ appointment, prevStep, nextStep }) => {
  return (
    <div>
      {/* Heading */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Stethoscope className="text-blue-600 mr-2" size={24} />
          <h2 className="text-xl font-bold text-gray-800">Recommended Tests</h2>
        </div>

        {/* Test List */}
        <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
          {appointment.recommendedTests && appointment.recommendedTests.length > 0 ? (
            <div className="space-y-3">
              {appointment.recommendedTests.map((test, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border-l-4 border-blue-500 shadow-sm"
                >
                  <h3 className="font-bold text-gray-800">{test.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{test.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="mb-3 text-gray-400">
                <Stethoscope size={32} className="mx-auto" />
              </div>
              <p className="text-gray-600">No tests have been recommended yet.</p>
              <p className="text-sm text-gray-500 mt-1">
                The doctor will review your symptoms and provide recommendations.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
        >
          Back
        </button>

        <button
          onClick={nextStep}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
        >
          Continue to Upload Results <ChevronRight size={18} className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Step3TestRecommendation;
