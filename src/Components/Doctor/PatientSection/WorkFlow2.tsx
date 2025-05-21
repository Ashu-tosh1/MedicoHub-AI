import React, { useState } from "react";
import { Plus, X, ChevronRight } from "lucide-react";

type Test = {
  testName: string;
  testType: string;
  description: string;
};

type OrderTestsStepProps = {
  recommendedTests: Test[];
  setRecommendedTests: React.Dispatch<React.SetStateAction<Test[]>>;
  isSubmittingTests: boolean;
  onNext: () => void;
};

const OrderTestsStep: React.FC<OrderTestsStepProps> = ({
  recommendedTests,
  setRecommendedTests,
  isSubmittingTests,
  onNext
}) => {
  const [newTest, setNewTest] = useState<Test>({
    testName: "",
    testType: "",
    description: "",
  });

  const addTest = () => {
    if (
      newTest.testName.trim() &&
      newTest.testType.trim()
    ) {
      setRecommendedTests((prev) => [...prev, newTest]);
      setNewTest({ testName: "", testType: "", description: "" });
    }
  };

  const removeTest = (index: number) => {
    setRecommendedTests((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fade-in">
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <h3 className="font-bold text-lg text-gray-800 mb-4">Recommended Tests</h3>
        
        <div className="grid gap-3 md:grid-cols-3 mb-4">
          <input
            className="border p-2 rounded"
            placeholder="Test name"
            value={newTest.testName}
            onChange={(e) =>
              setNewTest({ ...newTest, testName: e.target.value })
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="Test type"
            value={newTest.testType}
            onChange={(e) =>
              setNewTest({ ...newTest, testType: e.target.value })
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="Description (optional)"
            value={newTest.description}
            onChange={(e) =>
              setNewTest({ ...newTest, description: e.target.value })
            }
          />
        </div>
        <button
          onClick={addTest}
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <Plus size={16} className="mr-1" /> Add Test
        </button>

        <ul className="mt-6 space-y-3">
          {recommendedTests.map((test, index) => (
            <li key={index} className="border p-3 rounded-md bg-blue-50 border-blue-100 flex justify-between items-start">
              <div>
                <p className="font-medium text-blue-700">{test.testName}</p>
                <p className="text-sm text-gray-600">Type: {test.testType}</p>
                {test.description && <p className="text-sm text-gray-600">{test.description}</p>}
              </div>
              <button
                onClick={() => removeTest(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={18} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onNext}
        disabled={isSubmittingTests}
        className={`mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center ${isSubmittingTests ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
      >
        {isSubmittingTests ? 'Submitting...' : 'Review Test Results'} <ChevronRight size={18} className="ml-2" />
      </button>
    </div>
  );
};

export default OrderTestsStep;