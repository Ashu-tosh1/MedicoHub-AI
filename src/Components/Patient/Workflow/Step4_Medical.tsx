/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import { FileUp, CheckCircle, ChevronRight } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

type TestReportUploadProps = {
  appointment: any;
  prevStep: () => void;
  nextStep: () => void;
};

const TestReportUpload: React.FC<TestReportUploadProps> = ({
  appointment,
  prevStep,
  nextStep,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [reportNotes, setReportNotes] = useState<string>("");
  const [hasExistingReport, setHasExistingReport] = useState<boolean>(false);

  // Check if test report already exists
  useEffect(() => {
    const checkExistingReport = async () => {
      if (!appointment?.id) return;

      try {
        const response = await axios.get(`/api/tests/results/${appointment.id}`);
        const data = response.data;
        console.log("Report data:", data);

        if (data?.report?.fileUrl) {
          setReportUrl(data.report.fileUrl);
          setReportNotes(data.report.results || "");
          setHasExistingReport(true);
        } 
      } catch (error) {
        console.error("Error checking existing test report:", error);
      }
    };

    checkExistingReport();
  }, [appointment?.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (hasExistingReport) {
      nextStep();
      return;
    }

    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      setIsUploading(true);

      // Replace this mock with your actual file upload logic
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockFileUrl = `https://example.com/uploads/${file.name}`;

      setReportUrl(mockFileUrl);

      await axios.post("/api/appointments/testReports", {
        appointmentId: appointment.id,
        reportUrl: mockFileUrl,
        notes: reportNotes,
        fileName: file.name,
      });

      toast.success("Test report uploaded successfully");
      nextStep();
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload the test report");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <FileUp className="text-blue-600 mr-2" size={24} />
          <h2 className="text-xl font-bold text-gray-800">
            {hasExistingReport ? "Test Report Uploaded" : "Upload Test Reports"}
          </h2>
        </div>

        {hasExistingReport ? (
          <div className="bg-green-50 p-5 rounded-lg border border-green-100 mb-6">
            <div className="flex items-center mb-4">
              <CheckCircle className="text-green-500 mr-2" size={24} />
              <p className="text-green-700 font-medium">
                Test report has already been uploaded.
              </p>
            </div>
            <p className="text-gray-600 mb-2">
              <strong>Report:</strong>{" "}
              <a
                href={reportUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View uploaded report
              </a>
            </p>
            {reportNotes && (
              <p className="text-gray-600">
                <strong>Notes:</strong> {reportNotes}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 mb-6">
            <p className="text-gray-700 mb-4">
              Please upload your test results related to the recommended tests. Supported formats include PDF, JPG, and PNG.
            </p>

            <div className="border-2 border-dashed border-blue-200 rounded-lg p-8 text-center mb-4">
              <input
                type="file"
                id="fileUpload"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
              <label
                htmlFor="fileUpload"
                className="cursor-pointer flex flex-col items-center"
              >
                <FileUp size={40} className="text-blue-500 mb-3" />
                <span className="text-blue-700 font-medium mb-2">
                  Click to upload or drag and drop
                </span>
                <span className="text-gray-500 text-sm">
                  PDF, JPG or PNG (max. 5MB)
                </span>
              </label>
            </div>

            {file && (
              <div className="bg-white p-3 rounded-lg border border-blue-100 mb-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{file.name}</p>
                  <p className="text-gray-500 text-sm">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                placeholder="Add any relevant information about the test results..."
                value={reportNotes}
                onChange={(e) => setReportNotes(e.target.value)}
              ></textarea>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
        >
          Back
        </button>

        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Uploading...
            </>
          ) : hasExistingReport ? (
            <>Continue <ChevronRight size={18} className="ml-2" /></>
          ) : (
            <>Upload & Continue <ChevronRight size={18} className="ml-2" /></>
          )}
        </button>
      </div>
    </div>
  );
};

export default TestReportUpload;
