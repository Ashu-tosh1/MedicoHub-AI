'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { CheckCircle, X } from 'lucide-react';
import axios from 'axios';
import { Doctor } from '@/lib/mockData'; 

interface Props {
  selectedDoctor: Doctor;
  onClose: () => void;
}

const getDayName = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export const DoctorBookingModal = ({ selectedDoctor, onClose }: Props) => {
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [weekStart, setWeekStart] = useState(new Date());
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  const [availability, setAvailability] = useState<Record<string, string[]>>({});

  const fetchAvailability = async (doctorId: string | number) => {
    try {
      const response = await axios.post('/api/doctor/availability', {
        doctorId,
      });
      setAvailability(response.data);
    } catch (error) {
      console.error('Error fetching doctor availability:', error);
    }
  };
  

  useEffect(() => {
    if (selectedDoctor.id) {
      fetchAvailability(selectedDoctor.id);
    }
  }, [selectedDoctor]);

  const getWeekDates = (startDate: Date) => {
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const next = new Date(startDate);
      next.setDate(startDate.getDate() + i);
      dates.push(next.toISOString().split('T')[0]);
    }
    return dates;
  };

  const weekDates = getWeekDates(weekStart);

  const handlePrevWeek = () => {
    const prev = new Date(weekStart);
    prev.setDate(prev.getDate() - 7);
    setWeekStart(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + 7);
    setWeekStart(next);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !user) return;

    try {
      const patientResponse = await axios.post('/api/patient/getId', {
        clerkUserId: user.id,
      });

      const { patientId } = patientResponse.data;
      if (!patientId) {
        console.error('Patient ID not found');
        return;
      }

      const response = await axios.post('/api/appointments/request', {
        patientId,
        doctorId: selectedDoctor.id,
        date: new Date(selectedDate).toISOString(),
        time: selectedTime,
        type: 'Consultation',
        symptoms: '',
      });

      console.log('Appointment booked:', response.data);
      setIsBookingComplete(true);
    } catch (error) {
      console.error('Failed to book appointment:', error);
      alert('Failed to book appointment. Please try again later.');
    }
  };

  const handleClose = () => {
    setIsBookingComplete(false);
    setSelectedDate(null);
    setSelectedTime(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50  bg-opacity-100 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full p-8 relative z-50 transition-all">
        {isBookingComplete ? (
          <div className="space-y-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Appointment Confirmed</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Your appointment with <strong>{selectedDoctor.name}</strong> is scheduled for:
            </p>
            <p className="text-blue-600 font-semibold text-lg">
              {formatDate(selectedDate!)} at {selectedTime}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900 p-3 rounded-md">
              A confirmation email has been sent. Please arrive 15 minutes early.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Book Appointment</h2>
              <button onClick={handleClose}>
                <X className="w-6 h-6 text-gray-500 hover:text-red-500" />
              </button>
            </div>

            {/* Doctor Info */}
            <div className="border p-4 rounded-lg mb-6 bg-gray-50 dark:bg-gray-800">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedDoctor.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{selectedDoctor.department}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedDoctor.experience} years experience • {selectedDoctor.location}
              </p>
            </div>

            {/* Date Selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3 text-sm text-gray-700 dark:text-gray-300">
                <button onClick={handlePrevWeek}>&lt; Previous</button>
                <span className="font-medium">
                  {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
                </span>
                <button onClick={handleNextWeek}>Next &gt;</button>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {weekDates.map((date) => (
                  <div
                    key={date}
                    onClick={() => {
                      if (availability[date]) {
                        setSelectedDate(date);
                        setSelectedTime(null);
                      }
                    }}
                    className={`text-center p-2 rounded-lg cursor-pointer border transition text-sm
                      ${
                        availability[date]
                          ? selectedDate === date
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      }`}
                  >
                    <div>{getDayName(date)}</div>
                    <div>{new Date(date).getDate()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="mb-6">
              <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Available Time Slots</h5>
              {selectedDate && availability[selectedDate] ? (
                <div className="grid grid-cols-3 gap-2">
                  {availability[selectedDate].map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition
                        ${
                          selectedTime === time
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-blue-700 hover:bg-blue-50 border-blue-200'
                        }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No availability for this date.</p>
              )}
            </div>

            {/* Book Button */}
            <div className="text-right">
              <button
                onClick={handleBookAppointment}
                disabled={!selectedDate || !selectedTime}
                className={`px-6 py-2 rounded-lg font-semibold transition
                  ${
                    !selectedDate || !selectedTime
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
              >
                Book Appointment
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
