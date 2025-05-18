'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  Pill,
  Settings,
  Home,
  Menu,
  User2,
  X,
  VideoIcon,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';

const navItems = [
  { name: 'Dashboard', icon: Home, path: '/patient/dashboard' },
  { name: 'Doctors', icon: Users, path: '/patient/doctors' },
  { name: 'Appointments', icon: Calendar, path: '/patient/appointments' },
  { name: 'Video Call', icon: VideoIcon, path: '/patient/videocall' },
  { name: 'Ai SymtomGenerate', icon: Settings, path: '/patient/symptomchecker' },
  { name: 'Pharmacy', icon: Pill, path: '/patient/pharmacy' },
  { name: 'Profile', icon: User2, path: '/patient/profile' },
];

const PatientSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const { user, isLoaded } = useUser();

  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);

  useEffect(() => {
    const fetchPatient = async () => {
      if (isLoaded && user) {
        try {
          const clerkId = user.id;
          const res = await fetch(`/api/patient/profile?clerkId=${clerkId}`);
          if (!res.ok) throw new Error("Failed to fetch patient data");
          const data = await res.json();
          setPatientName(data.name || '');
          setPatientAge(data.age ? `${data.age} years old` : '');
        } catch (error) {
          console.error("Error fetching patient:", error);
        }
      }
    };

    fetchPatient();
  }, [isLoaded, user]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-5 left-4 z-40">
        <button
          onClick={toggleMobileSidebar}
          className="p-2 bg-primary text-white rounded-lg shadow-md"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed z-40 top-0 left-0 mt-[58px] h-full bg-white border-r shadow-lg flex flex-col transition-all duration-300',
          collapsed ? 'w-20' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && (
            <h1 className="text-l font-semibold text-gray-800">Patient Portal</h1>
          )}
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-blue-600 hidden lg:block"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Patient Info */}
        <div className={`p-4 border-b ${collapsed ? 'text-center' : ''}`}>
          <div className="relative mx-auto">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-semibold">
              {patientName ? patientName.split(' ')[0][0] : 'P'}
            </div>
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
          {!collapsed && (
            <div className="mt-2 text-center">
              <h2 className="text-sm font-medium text-gray-800">{patientName || 'Patient'}</h2>
              <p className="text-xs text-gray-500">{patientAge}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map(({ name, icon: Icon, path }) => (
            <Link href={path} key={name}>
              <div
                className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition group"
                title={collapsed ? name : ''}
              >
                <Icon size={20} className="min-w-[20px]" />
                {!collapsed && <span className="ml-3 text-sm">{name}</span>}
              </div>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t text-xs text-gray-400 text-center">
          {!collapsed && '© 2025 MedicoHub'}
        </div>
      </div>
    </>
  );
};

export default PatientSidebar;
