'use client';

import React, { useState } from 'react';
import { Upload, FileUp, FileText, PieChart, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
// import { toast } from 'react-hot-toast';
type TestType = {
  name: string;
  description: string;
};

type Medication = {
  name: string;
  dosage: string;
  instructions: string;
};

interface Props {
  appointment: {
    patientId: string;
    doctorId: string;
    id: string;
    patientName: string;
    doctorName: string;
    doctorSpecialty: string;
    appointmentDate: string;
    appointmentTime: string;
    location: string;
    status: string;
    symptoms?: string[];
    recommendedTests?: TestType[];
    testResults?: string;
    medications?: Medication[];
  };
  prevStep: () => void;
  nextStep: () => void;
}

const TestReportUpload: React.FC<Props> = ({ appointment, prevStep, nextStep }) => {
  const [testReport, setTestReport] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleTestReportUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTestReport(file);
    setUploading(true);

    try {
      // 1. Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'test_upload'); // replace with your actual preset
      formData.append('cloud_name', 'djpma9kmt'); // replace with your Cloudinary name

      const cloudRes = await fetch('https://api.cloudinary.com/v1_1/djpma9kmt/auto/upload', {
        method: 'POST',
        body: formData,
      });

      const cloudData = await cloudRes.json();

      if (!cloudData.secure_url) {
        throw new Error('Cloudinary upload failed');
      }

      const fileUrl = cloudData.secure_url;

      // 2. Save to your database
      const res = await fetch('/api/reports/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: appointment.id,
          doctorId: appointment.doctorId,
          patientId: appointment.patientId,
          name: file.name,
          type: 'LAB_REPORT',
          fileUrl,
          results: 'Test report uploaded.',
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save report in DB');
      }

      toast.success('Report uploaded and saved!');
    } catch (error) {
      console.error(error);
      toast.error('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Upload className="text-blue-600 mr-2" size={24} />
          <h2 className="text-xl font-bold text-gray-800">Upload Test Results</h2>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition duration-300">
            <input
              type="file"
              id="testReport"
              onChange={handleTestReportUpload}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <label htmlFor="testReport" className="cursor-pointer">
              <FileUp className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-600">Click to upload or drag and drop your test reports</p>
              <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (max. 10MB)</p>
            </label>
            {testReport && (
              <div className="mt-4 p-3 bg-green-50 rounded flex items-center">
                <FileText size={18} className="text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">{testReport.name}</span>
              </div>
            )}
            {uploading && <p className="text-sm text-blue-600 mt-3">Uploading...</p>}
          </div>
        </div>

        {appointment.testResults && (
          <div className="mt-6">
            <div className="flex items-center mb-4">
              <PieChart className="text-blue-600 mr-2" size={24} />
              <h3 className="font-bold text-gray-800">Test Results Summary</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded border border-gray-200 font-mono text-sm whitespace-pre-line">
              {appointment.testResults}
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
          onClick={nextStep}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
        >
          View Medications <ChevronRight size={18} className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default TestReportUpload;
