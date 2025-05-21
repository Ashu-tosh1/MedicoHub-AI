/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { ChevronRight, Eye, Download, X, CheckSquare, Calendar, User } from "lucide-react";
import { formatShortDate } from "@/lib/utils";
// import { formatDate } from "../../utils/dateUtils";

type Report = {
  id: string;
  name: string;
  status: string;
  type: string;
  date: string;
  patientName: string;
  doctorName: string;
  results?: string;
  fileUrl: string;
};

type ReviewResultsStepProps = {
    isLoadingReport: boolean;
    mainReport: Report ;
    relatedReports: Report[];
    testResults: string | null;
    updateReportStatus: (reportId: string, status: string) => void;
    onNext: () => void;
  };
const ReviewResultsStep: React.FC<ReviewResultsStepProps> = ({
  isLoadingReport,
  mainReport,
  relatedReports,
  testResults,
  updateReportStatus,
  onNext,
}) => {
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedFile, setSelectedFile] = useState<Report | null>(null);

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const viewPdf = (report: Report) => {
    setSelectedFile(report);
    setShowPdfViewer(true);
  };

  const closePdfViewer = () => {
    setShowPdfViewer(false);
    setSelectedFile(null);
  };

  return (
    <div className="fade-in">
      {isLoadingReport ? (
        <div className="flex justify-center items-center h-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading medical report...</p>
          </div>
        </div>
      ) : (
        <>
          {mainReport ? (
            <div className="mb-6 bg-white p-5 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-xl text-gray-800">{mainReport.name}</h3>
                  <div className="mt-2 flex flex-wrap gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(mainReport.status)}`}>
                      Status: {mainReport.status}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      Type: {mainReport.type}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => viewPdf(mainReport)}
                  className="bg-blue-100 text-blue-600 py-2 px-4 rounded hover:bg-blue-200 flex items-center transition"
                >
                  <Eye size={16} className="mr-1" /> View PDF
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Calendar size={16} className="mr-2" />
                    <span className="text-sm">Date: {formatShortDate(mainReport.date)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <User size={16} className="mr-2" />
                    <span className="text-sm">Patient: {mainReport.patientName}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <User size={16} className="mr-2" />
                    <span className="text-sm">Doctor: {mainReport.doctorName}</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <h4 className="font-medium text-gray-800 mb-2">Result Summary</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{mainReport.results || "No result summary available."}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 bg-white p-5 rounded-lg shadow-sm">
              <p className="text-gray-500 text-center py-4">No medical report found.</p>
            </div>
          )}

          {/* Related Reports */}
          {relatedReports.length > 0 && (
            <div className="mb-6 bg-white p-5 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Related Reports</h3>
              <ul className="divide-y divide-gray-200">
                {relatedReports.map((report) => (
                  <li key={report.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{report.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(report.status)}`}>
                          {report.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatShortDate(report.date)}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewPdf(report)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md flex items-center"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                      <a
                        href={report.fileUrl}
                        download
                        className="p-2 text-green-600 hover:bg-green-50 rounded-md flex items-center"
                        title="Download"
                      >
                        <Download size={18} />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Test Results Section */}
          {testResults && (
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Test Results</h3>
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100 whitespace-pre-wrap">
                <p className="text-gray-700">{testResults}</p>
              </div>
            </div>
          )}

          {/* PDF Viewer Modal */}
          {showPdfViewer && selectedFile && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
              <div className="bg-white rounded-lg w-full max-w-5xl h-5/6 flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{selectedFile.name}</h3>
                    <p className="text-sm text-gray-500">
                      {formatShortDate(selectedFile.date)} • {selectedFile.type}
                    </p>
                  </div>
                  <button onClick={closePdfViewer} className="text-gray-500 hover:text-gray-800">
                    <X size={24} />
                  </button>
                </div>
                <div className="flex-1 p-2 overflow-hidden">
                  <iframe
                    src={selectedFile.fileUrl}
                    className="w-full h-full border-0"
                    title={selectedFile.name}
                  />
                </div>
                <div className="p-3 border-t flex justify-between items-center">
                  <div className="flex items-center">
                    <CheckSquare size={16} className="text-green-600 mr-1" />
                    <span className="text-sm text-gray-600">Report status: {selectedFile.status}</span>
                  </div>
                  <a
                    href={selectedFile.fileUrl}
                    download
                    className="py-2 px-4 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center"
                  >
                    <Download size={16} className="mr-1" /> Download
                  </a>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={onNext}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center hover:bg-blue-700"
          >
            Prescribe Medication <ChevronRight size={18} className="ml-2" />
          </button>
        </>
      )}
    </div>
  );
};

export default ReviewResultsStep;