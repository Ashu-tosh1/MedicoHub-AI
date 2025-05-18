'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { motion } from 'framer-motion';
import PatientSidebar from '../PatientSidebar';

type Appointment = {
  id: string;
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  status: string;
};

export default function PatientAppointments() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchAppointments = async () => {
      if (isLoaded && isSignedIn) {
        try {
          const clerkUserId = user.id;

          const patientResponse = await axios.post('/api/patient/getId', {
            clerkUserId,
          });

          if (patientResponse.data.error) {
            setError(patientResponse.data.error);
            setLoading(false);
            return;
          }

          const patientId = patientResponse.data.patientId;

          const response = await axios.get(
            `/api/appointments/booked?patientId=${patientId}`
          );
          setAppointments(response.data);
          setLoading(false);
        } catch (err) {
            console.log(err)
          setError('Failed to fetch appointments.');
          setLoading(false);
        }
      }
    };

    fetchAppointments();
  }, [isLoaded, isSignedIn, user]);

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading appointments...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
     
        <aside className="w-1/6 p-6 bg-white dark:bg-gray-800 shadow-md">
         
          <PatientSidebar/>
       
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Your Appointments</h2>

        {appointments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300">No appointments found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appt, index) => (
              <motion.div
                key={appt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300"
              >
                <h3 className="text-xl font-semibold text-blue-600 mb-2">
                   {appt.doctorName}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Specialization:</strong> {appt.specialization}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Date:</strong> {appt.date}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Time:</strong> {appt.time}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Status:</strong>{' '}
                  <span
                    className={`font-medium ${
                      appt.status === 'CONFIRMED'
                        ? 'text-green-500'
                        : appt.status === 'PENDING'
                        ? 'text-yellow-500'
                        : 'text-red-500'
                    }`}
                  >
                    {appt.status}
                  </span>
                </p>
                    {appt.status === 'CONFIRMED' ? (
                        <button
                            onClick={() => router.push(`/patient/consulation/${appt.id}`)}
                            className="mt-4 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300">
                            Start Consultation
                        </button>
                    ) 
                    : appt.status === 'Pending' ? (
                        <p className="mt-4 text-yellow-600 font-medium">Wait for your confirmation from the doctor.</p>
                      ) : (
                        <p className="mt-4 text-red-500 font-medium">Appointment status: {appt.status}</p>
                      )}
                    
                
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
