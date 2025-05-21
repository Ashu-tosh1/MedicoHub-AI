/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Phone, Video } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import PatientSidebar from '../Patient/PatientSidebar';
import SidebarContent from '../Doctor/DoctorSidebar/DoctorSidebar';

const formatAppointmentTime = (time: string) => {
  const [hour, minute] = time.split(':');
  const date = new Date();
  date.setHours(Number(hour), Number(minute));
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const groupAppointmentsByDate = (appointments: any[]) => {
  return appointments.reduce((acc: any, appt) => {
    const dateKey = new Date(appt.date).toLocaleDateString();
    acc[dateKey] = acc[dateKey] || [];
    acc[dateKey].push(appt);
    return acc;
  }, {});
};

const isPastAppointment = (date: Date, time: string) => {
  const [hour, minute] = time.split(':').map(Number);
  const apptDateTime = new Date(date);
  apptDateTime.setHours(hour, minute, 0, 0);
  return new Date() > apptDateTime;
};

const VideoCalls = () => {
  const router = useRouter();
  const { user } = useUser();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;

      try {
        const response = await fetch('/api/videocall/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Failed to fetch appointments');

        const appointments = data.appointments.map((a: any) => ({
          ...a,
          date: new Date(a.date),
        }));

        setAppointments(appointments);

        if (appointments.length > 0) {
          setUserRole(appointments[0].doctor ? 'PATIENT' : 'DOCTOR');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const groupedAppointments = groupAppointmentsByDate(appointments);
  const dateKeys = Object.keys(groupedAppointments).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const handleJoinCall = (id: string) => {
    router.push(`/videocalls/?appointmentId=${id}`);
  };

  if (isLoading) return <div className="text-center p-10">Loading...</div>;
  if (error) return <div className="text-red-600 text-center p-10">{error}</div>;

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex">
      <div className="w-64 bg-gray-100 p-4 border-r">
        {userRole === 'PATIENT' ? <PatientSidebar /> : <SidebarContent />}
      </div>

      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header with title and today's date */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Video Consultations</h1>
          <div className="text-sm text-gray-500">{today}</div>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white p-6 text-center rounded-lg shadow">
            <Video className="w-10 h-10 mx-auto text-gray-400" />
            <p className="text-lg mt-4">
              {userRole === 'PATIENT'
                ? 'You have no upcoming video appointments.'
                : 'No scheduled video calls with patients.'}
            </p>
          </div>
        ) : (
          dateKeys.map((date) => (
            <div key={date} className="mb-8">
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">{date}</h2>
              </div>

              <div className="space-y-4">
                {groupedAppointments[date].map((appt: any) => {
                  const isPast = isPastAppointment(appt.date, appt.time);

                  return (
                    <div
                      key={appt.id}
                      className="p-5 bg-white rounded-lg shadow hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatAppointmentTime(appt.time)}
                          </p>
                          <h3 className="text-lg font-semibold mt-1">
                            {userRole === 'PATIENT'
                              ? `Dr. ${appt.doctor?.name}`
                              : `Patient: ${appt.patient?.name}`}
                          </h3>
                          {appt.doctor?.department && (
                            <p className="text-sm text-gray-600">{appt.doctor.department}</p>
                          )}
                          <span
                            className={`mt-2 inline-block text-xs px-2 py-1 rounded-full ${
                              isPast
                                ? 'bg-gray-200 text-gray-600'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {isPast ? 'Past Call' : appt.type}
                          </span>
                        </div>

                        {!isPast && (
                          <button
                            onClick={() => handleJoinCall(appt.id)}
                            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Join Call
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VideoCalls;
