'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  BarChart3,
  CalendarClock,
  Users,
  // FileText,
  // Activity,
  // Settings,
  Menu,
  X,
  Video,
} from 'lucide-react';

interface Doctor {
  name: string;
  department: string;
}

export default function SidebarContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const res = await fetch('/api/doctor/sidebar');
        if (!res.ok) throw new Error('Failed to fetch doctor info');
        const data = await res.json();
        setDoctor(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctor();
  }, []);

  if (loading) return <div className="p-4 text-white">Loading doctor info...</div>;
  if (!doctor) return <div className="p-4 text-white">Doctor info not found.</div>;

  const NavItem = ({
    icon,
    text,
    route,
    expanded,
  }: {
    icon: React.ReactNode;
    text: string;
    route: string;
    expanded: boolean;
  }) => {
    const isActive = pathname === route;

    return (
      <div
        onClick={() => router.push(route)}
        className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
          isActive ? 'bg-indigo-800' : 'hover:bg-indigo-700'
        }`}
      >
        <div className={`${expanded ? 'mr-3' : 'mx-auto'}`}>{icon}</div>
        {expanded && <span>{text}</span>}
      </div>
    );
  };

  return (
    <div
      className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-indigo-900 text-white transition-all h-[800px] duration-300 ease-in-out`}
    >
      <div className="flex flex-col h-full">
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

          <nav className="space-y-2">
            <NavItem icon={<BarChart3 />} text="Dashboard" route="/doctor/dashboard" expanded={sidebarOpen} />
            <NavItem icon={<CalendarClock />} text="Appointments" route="/doctor/appointments" expanded={sidebarOpen} />
            <NavItem icon={<Users />} text="Patients" route="/doctor/patients" expanded={sidebarOpen} />
            <NavItem icon={<Video />} text="Video Call" route="/doctor/videocall" expanded={sidebarOpen} />
            {/* <NavItem icon={<Activity />} text="Analytics" route="/doctor/analytics" expanded={sidebarOpen} />
            <NavItem icon={<Settings />} text="Settings" route="/doctor/settings" expanded={sidebarOpen} /> */}
          </nav>
        </div>
      </div>
    </div>
  );
}
