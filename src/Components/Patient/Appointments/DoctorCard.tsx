import React, { useState } from 'react';

import { Calendar, X } from 'lucide-react';
import { Doctor } from '@/lib/mockData';
import Image from 'next/image';

interface DoctorCardProps {
  doctors: Doctor[];
  onSelectDoctor: (doctor: Doctor) => void;
}

const getDayName = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

const getNextWeekDates = () => {
  const today = new Date();
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const next = new Date(today);
    next.setDate(today.getDate() + i);
    dates.push(next.toISOString().split('T')[0]);
  }
  return dates;
};

const DoctorCard: React.FC<DoctorCardProps> = ({ doctors, onSelectDoctor }) => {
  const [hoverDoctor, setHoverDoctor] = useState<number | null>(null);
  const weekDates = getNextWeekDates();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-6">
      {doctors.length > 0 ? (
        doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="relative group bg-white rounded-2xl shadow-md transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl overflow-hidden border border-gray-200"
            onMouseEnter={() => setHoverDoctor(doctor.id)}
            onMouseLeave={() => setHoverDoctor(null)}
          >
            <div className="p-5 text-center">
              <Image
                height={1}
                width={1}
                src={doctor.image}
                alt={doctor.name}
                className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-blue-300 shadow-lg transition-transform duration-300 group-hover:scale-105"
              />
              <h3 className="mt-3 text-xl font-semibold text-gray-800">{doctor.name}</h3>
              <div className="mt-1 inline-block bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs px-3 py-1 rounded-full">
                {doctor.department}
              </div>
              <p className="text-sm text-gray-500 mt-1">{doctor.experience} years experience</p>

              <button
                onClick={() => onSelectDoctor(doctor)}
                className="mt-5 w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Book Appointment
              </button>
            </div>

            {/* Hover Preview */}
            {hoverDoctor === doctor.id && (
              <div className="absolute inset-0 bg-white bg-opacity-95 z-20 rounded-2xl p-5 animate-fadeIn backdrop-blur-sm shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-gray-900 font-semibold">Availability</h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setHoverDoctor(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs mb-3">
                  {weekDates.map((date) => (
                    <div
                      key={date}
                      className={`rounded-md px-1 py-1 transition-all duration-300 ${
                        Object.keys(doctor.availability).includes(date)
                          ? 'bg-green-100 text-green-700 font-medium'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <div>{getDayName(date)}</div>
                      <div className="font-bold text-sm">{new Date(date).getDate()}</div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-500 mb-4">
                  {Object.keys(doctor.availability).length} available day(s) within the next 2 months
                </p>

                <button
                  onClick={() => onSelectDoctor(doctor)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Book Appointment
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="col-span-3 text-center py-12">
          <div className="flex flex-col items-center justify-center">
            <Calendar className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No doctors found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorCard;
