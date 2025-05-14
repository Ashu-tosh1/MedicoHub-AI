/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Doctor } from '@/lib/mockData';
import DoctorCard from './DoctorCard'; 
import { DoctorBookingModal } from './DoctorBookingModal'; 
import PatientSidebar from '../PatientSidebar';


interface FilterOptions {
  department: string;
  sortBy: 'name' | 'experience';
  sortOrder: 'asc' | 'desc';
}

const AppointmentPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    department: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctor");
        const data = await response.json();
        setDoctors(data);
        setFilteredDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    let result = [...doctors];

    if (searchTerm) {
      result = result.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterOptions.department) {
      result = result.filter(doctor => doctor.department === filterOptions.department);
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (filterOptions.sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (filterOptions.sortBy === 'experience') {
        comparison = a.experience - b.experience;
      }
      return filterOptions.sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredDoctors(result);
  }, [searchTerm, filterOptions, doctors]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilterOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleToggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  const departments = [...new Set(doctors.map(doctor => doctor.department))];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-blue-100 pt-8 pb-12">
      <div className='mr-[250px]'>
        <PatientSidebar />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full animate-fadeIn">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-blue-900">Find and Book Doctors</h1>
          <p className="mt-1 text-md text-gray-600">Search and schedule appointments with top specialists</p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-6 transition-all">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-1/2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search doctors by name or department"
                className="block w-full pl-10 pr-3 py-2 rounded-full border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <button
              onClick={handleToggleFilters}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-transform hover:scale-105 flex items-center gap-2 shadow"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

          {showFilters && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-all">
              <div>
                <label htmlFor="department" className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                <select
                  id="department"
                  className="block w-full pl-3 pr-10 py-2 text-base rounded-xl border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterOptions.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="sortBy" className="block text-sm font-semibold text-gray-700 mb-1">Sort By</label>
                <select
                  id="sortBy"
                  className="block w-full pl-3 pr-10 py-2 text-base rounded-xl border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterOptions.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="name">Name</option>
                  <option value="experience">Experience</option>
                </select>
              </div>

              <div>
                <label htmlFor="sortOrder" className="block text-sm font-semibold text-gray-700 mb-1">Sort Order</label>
                <select
                  id="sortOrder"
                  className="block w-full pl-3 pr-10 py-2 text-base rounded-xl border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterOptions.sortOrder}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Doctor Cards */}
        <DoctorCard
          doctors={filteredDoctors}
          onSelectDoctor={(doctor: Doctor) => setSelectedDoctor(doctor)}
        />
      </div>

      {selectedDoctor && (
        <DoctorBookingModal
          selectedDoctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      )}
    </div>
  );
};

export default AppointmentPage;
