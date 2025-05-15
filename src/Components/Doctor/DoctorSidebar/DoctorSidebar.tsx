'use client';

import { useState } from 'react';
import {
  Menu,
  X,
  BarChart3,
  CalendarClock,
  Users,
  FileText,
  Activity,
  Settings,
} from 'lucide-react';

interface DoctorSidebarProps {
  doctor: {
    name: string;
    department: string;
  };
}

const NavItem = ({
  icon,
  text,
  active = false,
  expanded,
}: {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  expanded: boolean;
}) => {
  return (
    <div
      className={`flex items-center p-2 rounded-lg ${
        active ? 'bg-indigo-800' : 'hover:bg-indigo-800'
      } cursor-pointer`}
    >
      <div className={`${expanded ? 'mr-3' : 'mx-auto'}`}>{icon}</div>
      {expanded && <span>{text}</span>}
    </div>
  );
};

export default function DoctorSidebar({ doctor }: DoctorSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-indigo-900 text-white transition-all duration-300 ease-in-out`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-indigo-800">
          {sidebarOpen ? (
            <h2 className="text-xl font-semibold">MedicoHub</h2>
          ) : (
            <span className="mx-auto text-2xl font-bold">M</span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-full hover:bg-indigo-800"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Doctor Info */}
        <div className="p-4">
          <div className="flex items-center space-x-4 mb-8">
            <div className="h-10 w-10 rounded-full bg-indigo-700 flex items-center justify-center text-sm font-bold">
              {doctor.name.charAt(0)}
            </div>
            {sidebarOpen && (
              <div>
                <p className="font-medium">{doctor.name}</p>
                <p className="text-xs text-indigo-300">{doctor.department}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <NavItem icon={<BarChart3 />} text="Dashboard" active={true} expanded={sidebarOpen} />
            <NavItem icon={<CalendarClock />} text="Appointments" expanded={sidebarOpen} />
            <NavItem icon={<Users />} text="Patients" expanded={sidebarOpen} />
            <NavItem icon={<FileText />} text="Medical Reports" expanded={sidebarOpen} />
            <NavItem icon={<Activity />} text="Analytics" expanded={sidebarOpen} />
            <NavItem icon={<Settings />} text="Settings" expanded={sidebarOpen} />
          </nav>
        </div>
      </div>
    </div>
  );
}
