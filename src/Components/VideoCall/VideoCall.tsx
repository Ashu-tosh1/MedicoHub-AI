'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Phone, Video } from 'lucide-react';
import { formatAppointmentTime, groupAppointmentsByDate } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import PatientSidebar from '../Patient/PatientSidebar';



// Types
interface Doctor {
  name: string;
  department: string;
}

interface Patient {
  name: string;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  type: string;
  status: string;
  doctor?: Doctor;
  patient?: Patient;
}

const VideoCalls = () => {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;

      try {
        const userId = user.id;
        const response = await fetch('/api/videocall/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const data = await response.json();
        setAppointments(data.appointments);

        if (data.appointments.length > 0) {
          setUserRole(data.appointments[0].doctor ? 'PATIENT' : 'DOCTOR');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Error loading appointments. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const handleJoinCall = (appointmentId: string) => {
    router.push(`/videocalls/?appointmentId=${appointmentId}`);
  };

  const groupedAppointments = groupAppointmentsByDate(appointments);
  const dateKeys = Object.keys(groupedAppointments).sort((a, b) =>
    new Date(a).getTime() - new Date(b).getTime()
  );

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-primary"></div>
          <p className="mt-2 text-gray-700">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full bg-red-100 text-red-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Error</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="flex min-h-screen">
        {userRole === 'PATIENT' && (
          <div className="w-64 bg-gray-100 p-4 border-r">
            {/* <PatientSidebar /> */}
                    <div className="text-gray-600 font-semibold">
                        <PatientSidebar/>
                    </div>
          </div>
        )}
        {userRole === 'DOCTOR' && (
          <div className="w-64 bg-gray-100 p-4 border-r">
            {/* <DoctorSidebar /> */}
            <div className="text-gray-600 font-semibold">Doctor Sidebar</div>
          </div>
        )}
        <div className="flex-1 container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-8">Video Consultations</h1>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Video className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No upcoming video consultations</h2>
            <p className="text-gray-500">
              {userRole === 'PATIENT'
                ? "You don't have any confirmed appointments scheduled for video consultation."
                : "You don't have any confirmed appointments with patients for video consultation."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {userRole === 'PATIENT' && (
        <div className="w-64 bg-gray-100 p-4 border-r">
          {/* <PatientSidebar /> */}
                  <div className="text-gray-600 font-semibold">
                      <PatientSidebar/>
          </div>
        </div>
      )}
      {userRole === 'DOCTOR' && (
        <div className="w-64 bg-gray-100 p-4 border-r">
          {/* <DoctorSidebar /> */}
          <div className="text-gray-600 font-semibold">Doctor Sidebar</div>
        </div>
      )}
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Video Consultations</h1>
          <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
            <Video className="h-4 w-4" />
            <span className="text-sm font-medium">{appointments.length} Upcoming</span>
          </div>
        </div>

        {dateKeys.map((dateKey) => (
          <div key={dateKey} className="mb-8">
            <div className="flex items-center mb-4">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">{dateKey}</h2>
            </div>

            <div className="space-y-4">
              {groupedAppointments[dateKey].map((appointment: Appointment) => (
                <div key={appointment.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center text-gray-500 mb-2">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{formatAppointmentTime(appointment.time)}</span>
                        </div>

                        <h3 className="text-lg font-semibold mb-1">
                          {userRole === 'PATIENT'
                            ? `Dr. ${appointment.doctor?.name}`
                            : `Patient: ${appointment.patient?.name}`}
                        </h3>

                        {userRole === 'PATIENT' && (
                          <p className="text-gray-600 text-sm">{appointment.doctor?.department}</p>
                        )}

                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {appointment.type}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleJoinCall(appointment.id)}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Join Call
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoCalls;
