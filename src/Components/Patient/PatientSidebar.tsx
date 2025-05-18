'use client';

import React, { useState } from 'react';
import {
  Users,
  Calendar,
  ClipboardList,
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
// import { Button } from '../ui/button';

const navItems = [
  { name: 'Dashboard', icon: Home, path: '/patient/dashboard' },
  { name: 'Doctors', icon: Users, path: '/patient/doctors' },
  { name: 'Appointments', icon: Calendar, path: '/patient/appointments' },
  { name: 'Medical Records', icon: ClipboardList, path: '/records' },
  {name : 'Video Call',icon: VideoIcon,path:'/patient/videocall'},
  { name: 'Ai SymtomGenerate', icon: Settings, path: '/patient/symptomchecker' },
  { name: 'Pharmacy', icon: Pill, path: '/patient/pharmacy' },
  { name: 'Profile', icon: User2, path: '/patient/profile' },

];

const PatientSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
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
          'fixed z-40 top-0 left-0 h-full bg-white border-r shadow-lg flex flex-col transition-all duration-300',
          collapsed ? 'w-20' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-2 rounded-md text-sm font-bold">MD</div>
              <h1 className="text-xl font-semibold text-gray-800">MedicoHub</h1>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-blue-600 hidden lg:block"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className={`p-4 border-b ${collapsed ? 'text-center' : ''}`}>
          <div className="relative mx-auto">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-semibold">
                Mr
            </div>
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
          {!collapsed && (
            <div className="mt-2">
              <h2 className="text-sm font-medium text-gray-800">Patient Name</h2>
              <p className="text-xs text-gray-500">age</p>
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
                    {/* <div>
                  <Button>
                      Schedule Appointment 
                  </Button>
          </div> */}
        </nav>
            
        {/* Footer (optional) */}
        <div className="p-4 border-t text-xs text-gray-400 text-center">
          {!collapsed && '© 2025 MedicoHub'}
        </div>
      </div>
    </>
  );
};

export default PatientSidebar;
