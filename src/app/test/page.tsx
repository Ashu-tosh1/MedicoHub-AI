// "use client"

// import { useState, useEffect } from 'react';
// import {
//   Calendar,
//   Clock,
//   FileText,
//   Pill,
//   ChevronRight,
//   Loader2,
//   Download
// } from 'lucide-react';
// import PatientSidebar from '@/Components/Patient/PatientSidebar';

// export default function PatientDashboard() {
//   const [dashboardData, setDashboardData] = useState({
//     appointments: [],
//     prescriptions: [],
//     medicalReports: []
//   });
//   const [loading, setLoading] = useState(true);
//   const [selectedAppointment, setSelectedAppointment] = useState(null);
//   const [relatedPrescriptions, setRelatedPrescriptions] = useState([]);
//   const [relatedReports, setRelatedReports] = useState([]);

//   useEffect(() => {
//     const loadDashboardData = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch('/api/demo'); // Replace mock with actual API
//         if (!response.ok) {
//           throw new Error('Failed to fetch dashboard data');
//         }
  
//         const data = await response.json(); // Parse JSON response
//         setDashboardData(data); // Save to state
//         console.log('Dashboard Data:', data); // Optional: debug log
  
//         if (data.appointments && data.appointments.length > 0) {
//           const firstAppointment = data.appointments[0];
//           setSelectedAppointment(firstAppointment);
//           findRelatedData(firstAppointment, data.prescriptions, data.medicalReports);
//         }
//       } catch (error) {
//         console.error('Error loading dashboard data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     loadDashboardData(); // Call async function
//   }, []);
  

//   // Function to find related prescriptions and reports for a selected appointment
//   const findRelatedData = (appointment, prescriptions, reports) => {
//     // Find related prescriptions based on doctor
//     const related = prescriptions.filter(prescription => 
//       prescription.doctor === appointment.doctor
//     );
    
//     setRelatedPrescriptions(related);
    
//     // Find related reports based on doctor
//     const relatedTests = reports.filter(report => 
//       report.doctor === appointment.doctor
//     );
    
//     setRelatedReports(relatedTests);
//   };

//   const handleAppointmentSelect = (appointment) => {
//     setSelectedAppointment(appointment);
//     findRelatedData(appointment, dashboardData.prescriptions, dashboardData.medicalReports);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   // Get status color
//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'CONFIRMED': return 'bg-green-100 text-green-800';
//       case 'PENDING': return 'bg-yellow-100 text-yellow-800';
//       case 'CANCELLED': return 'bg-red-100 text-red-800';
//       case 'COMPLETED': return 'bg-blue-100 text-blue-800';
//       case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800';
//       case 'ACTIVE': return 'bg-green-100 text-green-800';
//       case 'EXPIRED': return 'bg-gray-100 text-gray-800';
//       case 'READY': return 'bg-green-100 text-green-800';
//       case 'PROCESSING': return 'bg-yellow-100 text-yellow-800';
//       case 'REVIEWED': return 'bg-blue-100 text-blue-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Space for sidebar component you will import */}
//       <div className="w-64">
//               {/* This space will be filled by your sidebar component */}
//               <PatientSidebar/>
//       </div>
      
//       {/* Main Content */}
//       <div className="flex-1 overflow-auto">
//         <div className="container mx-auto px-6 py-8 max-w-6xl">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-800">Patient Medical History</h1>
//             <p className="text-gray-600 mt-1">View your appointments and related medical information</p>
//           </div>
          
//           {loading ? (
//             <div className="flex justify-center items-center py-16">
//               <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               {/* Appointment List */}
//               <div className="lg:col-span-1">
//                 <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
//                   <h2 className="text-xl font-semibold mb-4 flex items-center">
//                     <Calendar className="h-5 w-5 mr-2 text-blue-500" />
//                     Your Appointments
//                   </h2>
                  
//                   <div className="space-y-4">
//                     {dashboardData.appointments.length === 0 ? (
//                       <p className="text-gray-500 text-center py-4">No appointments found</p>
//                     ) : (
//                       dashboardData.appointments.map((appointment) => (
//                         <div 
//                           key={appointment.id}
//                           onClick={() => handleAppointmentSelect(appointment)}
//                           className={`p-4 rounded-xl transition-all hover:shadow-md ${
//                             selectedAppointment?.id === appointment.id 
//                               ? 'bg-blue-50 border-2 border-blue-400'
//                               : 'bg-white border border-gray-200 hover:border-blue-200'
//                           }`}
//                         >
//                           <div className="flex justify-between items-start">
//                             <div>
//                               <p className="font-medium text-gray-900">Dr. {appointment.doctor.split(' ')[1]}</p>
//                               <p className="text-sm text-gray-600">{appointment.department}</p>
//                             </div>
//                             <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(appointment.status)}`}>
//                               {appointment.status}
//                             </span>
//                           </div>
                          
//                           <div className="mt-3 flex items-center text-gray-600 text-sm">
//                             <Calendar className="h-4 w-4 mr-1" />
//                             <span>{formatDate(appointment.date)}</span>
//                             <Clock className="h-4 w-4 ml-3 mr-1" />
//                             <span>{appointment.time}</span>
//                           </div>
                          
//                           <div className="mt-2 flex justify-between items-center">
//                             <span className="text-sm text-gray-500">{appointment.type}</span>
//                             <div className="flex items-center">
//                               {relatedPrescriptions.length > 0 && appointment.id === selectedAppointment?.id && (
//                                 <Pill className="h-4 w-4 text-purple-500 mr-2" />
//                               )}
//                               {relatedReports.length > 0 && appointment.id === selectedAppointment?.id && (
//                                 <FileText className="h-4 w-4 text-blue-500 mr-2" />
//                               )}
//                               <ChevronRight className="h-4 w-4 text-blue-500" />
//                             </div>
//                           </div>
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 </div>
//               </div>
              
//               {/* Appointment Details */}
//               <div className="lg:col-span-2">
//                 {!selectedAppointment ? (
//                   <div className="bg-white rounded-xl shadow p-8 text-center border border-gray-100">
//                     <h3 className="text-xl font-medium text-gray-700 mb-2">Select an appointment</h3>
//                     <p className="text-gray-500">Choose an appointment from the list to view details</p>
//                   </div>
//                 ) : (
//                   <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
//                     <h2 className="text-xl font-semibold text-gray-800 mb-6">Appointment Details</h2>
                    
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                       <div className="p-4 bg-gray-50 rounded-xl">
//                         <h3 className="text-sm font-medium text-gray-500 mb-1">Doctor</h3>
//                         <p className="text-lg font-medium">{selectedAppointment.doctor}</p>
//                         <p className="text-gray-600">{selectedAppointment.department}</p>
//                       </div>
                      
//                       <div className="p-4 bg-gray-50 rounded-xl">
//                         <h3 className="text-sm font-medium text-gray-500 mb-1">Date & Time</h3>
//                         <p className="text-lg font-medium">{formatDate(selectedAppointment.date)}</p>
//                         <p className="text-gray-600">{selectedAppointment.time}</p>
//                       </div>
                      
//                       <div className="p-4 bg-gray-50 rounded-xl">
//                         <h3 className="text-sm font-medium text-gray-500 mb-1">Appointment Type</h3>
//                         <p className="text-lg font-medium">{selectedAppointment.type}</p>
//                       </div>
                      
//                       <div className="p-4 bg-gray-50 rounded-xl">
//                         <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
//                         <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedAppointment.status)}`}>
//                           {selectedAppointment.status}
//                         </span>
//                       </div>
//                     </div>
                    
//                     {selectedAppointment.symptoms && (
//                       <div className="mb-6">
//                         <h3 className="text-md font-medium text-gray-700 mb-2">Reported Symptoms</h3>
//                         <p className="bg-gray-50 p-4 rounded-xl text-gray-800">{selectedAppointment.symptoms}</p>
//                       </div>
//                     )}
                    
//                     {selectedAppointment.notes && (
//                       <div className="mb-6">
//                         <h3 className="text-md font-medium text-gray-700 mb-2">Notes</h3>
//                         <p className="bg-gray-50 p-4 rounded-xl text-gray-800">{selectedAppointment.notes}</p>
//                       </div>
//                     )}
                    
//                     {/* Appointment-Related Prescriptions */}
//                     {relatedPrescriptions.length > 0 && (
//                       <div className="mt-8">
//                         <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center">
//                           <Pill className="h-5 w-5 mr-2 text-purple-500" />
//                           Prescribed Medications
//                         </h3>
                        
//                         {relatedPrescriptions.map(prescription => (
//                           <div key={prescription.id} className="bg-purple-50 p-5 rounded-xl mb-4 border border-purple-100">
//                             <div className="flex justify-between items-center mb-3">
//                               <p className="font-medium">Prescription ({formatDate(prescription.issueDate)})</p>
//                               <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(prescription.status)}`}>
//                                 {prescription.status}
//                               </span>
//                             </div>
                            
//                             <div className="space-y-3">
//                               {prescription.medications && prescription.medications.map((med, index) => (
//                                 <div key={index} className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
//                                   <p className="font-medium text-gray-800">{med.name}</p>
//                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-sm">
//                                     <p className="text-gray-600"><span className="font-medium">Dosage:</span> {med.dosage}</p>
//                                     <p className="text-gray-600"><span className="font-medium">Frequency:</span> {med.frequency}</p>
//                                   </div>
//                                   {med.instructions && (
//                                     <p className="text-gray-600 mt-2 text-sm">
//                                       <span className="font-medium">Instructions:</span> {med.instructions}
//                                     </p>
//                                   )}
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
                    
//                     {/* Appointment-Related Medical Reports */}
//                     {relatedReports.length > 0 && (
//                       <div className="mt-8">
//                         <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center">
//                           <FileText className="h-5 w-5 mr-2 text-blue-500" />
//                           Test Reports
//                         </h3>
                        
//                         {relatedReports.map(report => (
//                           <div key={report.id} className="bg-blue-50 p-5 rounded-xl mb-4 border border-blue-100">
//                             <div className="flex justify-between items-center">
//                               <div>
//                                 <p className="font-medium text-gray-800">{report.name}</p>
//                                 <p className="text-sm text-gray-600">
//                                   {report.type.replace('_', ' ')} • {formatDate(report.date)}
//                                 </p>
//                               </div>
//                               <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(report.status)}`}>
//                                 {report.status}
//                               </span>
//                             </div>
                            
//                             {report.results && (
//                               <div className="mt-3 text-sm text-gray-600 bg-white p-3 rounded-xl border border-blue-100">
//                                 <span className="font-medium">Results:</span> {report.results}
//                               </div>
//                             )}
                            
//                             <div className="mt-4 flex justify-end">
//                               <button className="text-blue-600 hover:text-blue-800 bg-white hover:bg-blue-50 px-4 py-2 rounded-lg border border-blue-200 text-sm flex items-center shadow-sm transition-colors">
//                                 Download Report <Download className="h-4 w-4 ml-2" />
//                               </button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
                    
//                     {relatedPrescriptions.length === 0 && relatedReports.length === 0 && (
//                       <div className="mt-6 p-6 bg-gray-50 rounded-xl text-center">
//                         <p className="text-gray-500">No related prescriptions or test reports for this appointment</p>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }