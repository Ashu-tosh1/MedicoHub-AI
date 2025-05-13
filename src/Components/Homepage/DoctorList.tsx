"use client"
import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronRight } from 'lucide-react';
import Image from 'next/image';

// TypeScript interfaces
interface Doctor {
  id: number;
  name: string;
  department: string;
  imageUrl: string;
  specialization?: string;
  experience?: number;
}

interface DoctorCardProps {
  doctor: Doctor;
}

// Main component that renders the entire doctor finder page
const DoctorFinder: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Simulate loading doctors data
  useEffect(() => {
    // This would be replaced with your actual API call
    setTimeout(() => {
      const mockDoctors: Doctor[] = [
        { id: 1, name: 'Dr. Sarah Johnson', department: 'Cardiology',   imageUrl: '/file.svg', specialization: 'Heart Surgeon', experience: 12 },
        { id: 2, name: 'Dr. Michael Lee', department: 'Neurology',   imageUrl: '/api/placeholder/200/250', specialization: 'Neurologist', experience: 8 },
        { id: 3, name: 'Dr. Emily Davis', department: 'Pediatrics',   imageUrl: '/api/placeholder/200/250', specialization: 'Child Specialist', experience: 15 },
        { id: 4, name: 'Dr. Robert Wilson', department: 'Orthopedics',   imageUrl: '/api/placeholder/200/250', specialization: 'Joint Specialist', experience: 10 },
        { id: 5, name: 'Dr. Jessica Martinez', department: 'Dermatology',   imageUrl: '/api/placeholder/200/250', specialization: 'Skin Specialist', experience: 7 },
        { id: 6, name: 'Dr. David Wang', department: 'Cardiology',   imageUrl: '/api/placeholder/200/250', specialization: 'Cardiologist', experience: 9 },
        { id: 7, name: 'Dr. Olivia Brown', department: 'Neurology',   imageUrl: '/api/placeholder/200/250', specialization: 'Brain Specialist', experience: 14 },
        { id: 8, name: 'Dr. Thomas Anderson', department: 'Pediatrics',   imageUrl: '/api/placeholder/200/250', specialization: 'Pediatrician', experience: 11 },
      ];
      
      setDoctors(mockDoctors);
      setFilteredDoctors(mockDoctors);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter doctors by department
  const filterByDepartment = (department: string): void => {
    setSelectedDepartment(department);
    
    if (department === '') {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(doctor => doctor.department === department);
      setFilteredDoctors(filtered);
      
      // Update URL with query parameter
      const url = new URL(window.location.href);
      url.searchParams.set('department', department);
      window.history.pushState({}, '', url.toString());
    }
  };

  // Get unique departments for filter options
  const departments = ['', ...Array.from(new Set(doctors.map(doctor => doctor.department)))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Find a Doctor</h1>
        <p className="text-gray-600 mb-8">Book appointments with the best doctors in your area</p>
        
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8 animate-fadeIn">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search doctors by name..." 
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="relative min-w-[180px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={20} className="text-gray-400" />
              </div>
              <select 
                value={selectedDepartment}
                onChange={(e) => filterByDepartment(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="">All Departments</option>
                {departments.filter(d => d !== '').map((department) => (
                  <option key={department} value={department}>{department}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Department Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button 
            onClick={() => filterByDepartment('')}
            className={`px-4 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedDepartment === '' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          
          {departments.filter(d => d !== '').map((department) => (
            <button 
              key={department}
              onClick={() => filterByDepartment(department)}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedDepartment === department 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {department}
            </button>
          ))}
        </div>
        
        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <p className="text-gray-600 mb-4">{filteredDoctors.length} doctors found {selectedDepartment && `in ${selectedDepartment}`}</p>
            
            {/* Doctor Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};


const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <div className="bg-blue-50 rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg h-96">
      <div className="relative h-48 overflow-hidden">
        <Image 
          src={doctor.imageUrl} 
          alt={doctor.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900 to-transparent p-3">
          <div className="flex items-center">
            <div className="bg-white rounded-full px-2 py-1 text-xs font-medium text-blue-600">
              {doctor.department}
            </div>
            <div className="ml-auto flex items-center bg-white rounded-full px-2 py-1">

            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 flex flex-col h-48">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{doctor.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{doctor.specialization}</p>
        
        <div className="text-xs text-gray-500 mb-3">
          {doctor.experience} years experience
        </div>
        
        
        
        <div className="mt-auto">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center justify-center">
            Book Appointment
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
        
      
      </div>
    </div>
  );
};

export default DoctorFinder;