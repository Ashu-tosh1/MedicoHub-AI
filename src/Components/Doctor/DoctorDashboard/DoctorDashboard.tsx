/* eslint-disable react/no-unescaped-entities */
/* eslint-disable prefer-const */
"use client"
import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Users,
  User,
  CheckCircle,
  XCircle,
  CalendarClock,
  FileText,
 
} from 'lucide-react';
// import DoctorSidebar from '../DoctorSidebar/DoctorSidebar';
import { Doctor, MedicalReport } from '@/lib/mockData';
import SidebarContent from '../DoctorSidebar/DoctorSidebar';

// Define TypeScript interfaces
// Renamed to use PascalCase as is standard in TypeScript
interface Appointment {
  id: string;
  patient: {
    name: string;
  };
  patientId: string;
  doctor: string;
  date: string;
  time: string;
  type: string;
  status: string;
  symptoms?: string;
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  trend?: number;
}

interface AppointmentListProps {
  appointments: Appointment[];
  selectedDate: Date;
  currentDateTime: Date;
}

interface AppointmentItemProps {
  appointment: Appointment;
  status: 'current' | 'upcoming' | 'past';
}

interface AppointmentChartProps {
  data: number[];
}

interface AppointmentTypeDistributionProps {
  data: Record<string, number>;
}

interface RecentReportsProps {
  medicalReports: MedicalReport[];
}

export interface DoctorWithStats extends Doctor {
  stats: {
    todayAppointments: number;
    pendingAppointments: number;
    completedAppointments: number;
    totalPatients: number;
    monthlyAppointments: number[];
    appointmentsByType: Record<string, number>;
  };
  appointments: Appointment[]; // Added to match what's used in the component
  medicalReports: MedicalReport[]; // Added to match what's used in the component
}

interface DoctorDashboardProps {
  doctor: DoctorWithStats;
}

// Main Dashboard Component
export default function DoctorDashboard({ doctor }: DoctorDashboardProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  if (!doctor) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-48 bg-slate-200 rounded mb-4"></div>
          <div className="h-4 w-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Format date for display
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(currentDateTime);
  
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(currentDateTime);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SidebarContent/> 
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Header */}
        <header className="bg-white py-4 px-6 flex justify-between items-center shadow-sm sticky top-0 z-10">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{formattedDate}</p>
              <p className="text-xs text-gray-500">{formattedTime}</p>
            </div>
            
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium">
              {doctor.name.charAt(3)}{doctor.name.split(' ')[1]?.charAt(0)}
            </div>
          </div>
        </header>
        
        <main className="p-6">
          <div className="mb-6">
            <h2 className="text-blue-700 text-bold font-medium mb-2">Welcome back, {doctor.name}</h2>
            <p className="text-gray-500">{doctor.department} • {doctor.experience} years of experience</p>
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard 
              icon={<Calendar className="h-6 w-6 text-indigo-500" />}
              title="Today's Appointments"
              value={doctor.stats.todayAppointments}
              trend={+10}
            />
            <StatCard 
              icon={<Clock className="h-6 w-6 text-amber-500" />}
              title="Pending Approvals"
              value={doctor.stats.pendingAppointments}
              trend={-5}
            />
            <StatCard 
              icon={<CheckCircle className="h-6 w-6 text-emerald-500" />}
              title="Completed This Week"
              value={doctor.stats.completedAppointments}
              trend={+15}
            />
            <StatCard 
              icon={<Users className="h-6 w-6 text-purple-500" />}
              title="Total Patients"
              value={doctor.stats.totalPatients}
              trend={+3}
            />
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">Appointments Overview</h2>
                  <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                    <button 
                      onClick={() => setView('day')}
                      className={`px-3 py-1 rounded-md text-sm transition-colors ${view === 'day' ? 'bg-indigo-600 text-white' : ''}`}
                    >
                      Day
                    </button>
                    <button 
                      onClick={() => setView('week')}
                      className={`px-3 py-1 rounded-md text-sm transition-colors ${view === 'week' ? 'bg-indigo-600 text-white' : ''}`}
                    >
                      Week
                    </button>
                    <button 
                      onClick={() => setView('month')}
                      className={`px-3 py-1 rounded-md text-sm transition-colors ${view === 'month' ? 'bg-indigo-600 text-white' : ''}`}
                    >
                      Month
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <AppointmentChart data={doctor.stats.monthlyAppointments} />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">Appointment Types</h2>
              </div>
              <div className="p-6">
                <AppointmentTypeDistribution data={doctor.stats.appointmentsByType} />
              </div>
            </div>
          </div>
          
          {/* Today's Schedule */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Today's Schedule</h2>
                  <p className="text-sm text-gray-500">
                    {doctor.appointments.filter(apt => {
                      const aptDate = new Date(apt.date);
                      return aptDate.toDateString() === selectedDate.toDateString();
                    }).length} appointments
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                    <Calendar className="h-5 w-5 text-gray-600" />
                  </button>
                  <input 
                    type="date" 
                    className="border border-gray-200 rounded-lg py-2 px-3" 
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  />
                </div>
              </div>
            </div>
            <AppointmentList 
              appointments={doctor.appointments} 
              selectedDate={selectedDate} 
              currentDateTime={currentDateTime}
            />
          </div>
          
          {/* Medical Reports */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">Recent Medical Reports</h2>
                </div>
              </div>
              <RecentReports medicalReports={doctor.medicalReports.slice(0, 5)} />
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">Pending Prescriptions</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center text-gray-500 py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p>No pending prescriptions</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Stat Card Component
const StatCard = ({ icon, title, value, trend }: StatCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          
          {trend !== undefined && (
            <div className={`flex items-center mt-2 text-xs ${trend >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              <span>{trend > 0 ? '+' : ''}{trend}%</span>
              <span className="ml-1 text-gray-500">vs last week</span>
            </div>
          )}
        </div>
        <div className="bg-indigo-50 p-3 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

// Appointment List Component
const AppointmentList = ({ appointments, selectedDate, currentDateTime }: AppointmentListProps) => {
  // Filter appointments for selected date
  const filteredAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return aptDate.toDateString() === selectedDate.toDateString();
  });
  
  if (filteredAppointments.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500">
        <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-3" />
        <p>No appointments scheduled for this date.</p>
      </div>
    );
  }
  
  // Sort and categorize appointments
  const currentTime = currentDateTime.getHours() * 60 + currentDateTime.getMinutes();
  
  const getAppointmentTime = (timeStr: string): number => {
    // Convert time string (e.g. "9:30 AM") to minutes since midnight
    const [timePart, ampm] = timeStr.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };
  
  // Separate appointments into past, current, and upcoming
  const categorizedAppointments = filteredAppointments.reduce((acc: {
    past: Appointment[];
    current: Appointment[];
    upcoming: Appointment[];
  }, apt) => {
    const aptTime = getAppointmentTime(apt.time);
    
    if (selectedDate.toDateString() === currentDateTime.toDateString()) {
      // For today
      if (aptTime + 30 < currentTime) {
        acc.past.push(apt);
      } else if (aptTime - 15 <= currentTime && aptTime + 30 >= currentTime) {
        acc.current.push(apt);
      } else {
        acc.upcoming.push(apt);
      }
    } else if (selectedDate < currentDateTime) {
      // Past days
      acc.past.push(apt);
    } else {
      // Future days
      acc.upcoming.push(apt);
    }
    
    return acc;
  }, { past: [], current: [], upcoming: [] });
  
  const { past, current, upcoming } = categorizedAppointments;
  
  // Sort appointments by time
  const sortByTime = (a: Appointment, b: Appointment) => getAppointmentTime(a.time) - getAppointmentTime(b.time);
  past.sort(sortByTime);
  current.sort(sortByTime);
  upcoming.sort(sortByTime);
  
  return (
    <div className="divide-y divide-gray-100">
      {/* Current Appointments */}
      {current.length > 0 && (
        <div className="p-4 bg-green-50">
          <h3 className="font-medium text-green-800 mb-3 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            In Progress
          </h3>
          {current.map(appointment => (
            <AppointmentItem
              key={appointment.id}
              appointment={appointment}
              status="current"
            />
          ))}
        </div>
      )}
      
      {/* Upcoming Appointments */}
      {upcoming.length > 0 && (
        <div className="p-4">
          <h3 className="font-medium text-gray-700 mb-3 flex items-center">
            <CalendarClock className="h-4 w-4 mr-2" />
            Upcoming
          </h3>
          {upcoming.map(appointment => (
            <AppointmentItem
              key={appointment.id}
              appointment={appointment}
              status="upcoming"
            />
          ))}
        </div>
      )}
      
      {/* Past Appointments */}
      {past.length > 0 && (
        <div className="p-4 bg-gray-50">
          <h3 className="font-medium text-gray-500 mb-3 flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Past
          </h3>
          {past.map(appointment => (
            <AppointmentItem
              key={appointment.id}
              appointment={appointment}
              status="past"
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Individual Appointment Item
const AppointmentItem = ({ appointment, status }: AppointmentItemProps) => {
  return (
    <div className={`mb-3 p-4 rounded-lg ${
      status === 'current' ? 'bg-white border-l-4 border-green-500 shadow-sm' :
      status === 'upcoming' ? 'bg-white shadow-sm' : 
      'bg-white bg-opacity-70'
    }`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-4">
            <div className={`rounded-lg p-2 w-16 text-center ${
              status === 'current' ? 'bg-green-100 text-green-800' :
              status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-600'
            }`}>
              <p className="font-medium">{appointment.time}</p>
            </div>
          </div>
          <div>
            <h3 className="font-medium">{appointment.patient.name}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-3">{appointment.type}</span>
              {appointment.status === "CONFIRMED" ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" /> Confirmed
                </span>
              ) : appointment.status === "PENDING" ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <Clock className="h-3 w-3 mr-1" /> Pending
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {appointment.status}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <a href={`/patients/${appointment.patientId}`} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <User className="h-5 w-5 text-indigo-500" />
          </a>
          {status !== 'past' && (
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <XCircle className="h-5 w-5 text-red-500" />
            </button>
          )}
        </div>
      </div>
      {appointment.symptoms && (
        <div className="mt-2 ml-20 text-sm text-gray-600">
          <p><span className="font-medium">Symptoms:</span> {appointment.symptoms}</p>
        </div>
      )}
    </div>
  );
};

// Charts and Visualizations
const AppointmentChart = ({ data }: AppointmentChartProps) => {
  return (
    <div className="h-64 flex items-end">
      {data.map((value, index) => (
        <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
          <div 
            className="bg-indigo-500 rounded-t w-8 transition-all duration-300 hover:bg-indigo-600"
            style={{ height: `${(value / Math.max(...data, 1)) * 80}%` }}
          ></div>
          {index % 5 === 0 && (
            <span className="text-xs text-gray-500 mt-1">{index + 1}</span>
          )}
        </div>
      ))}
    </div>
  );
};

const AppointmentTypeDistribution = ({ data }: AppointmentTypeDistributionProps) => {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0) || 1;
  const colors: Record<string, string> = {
    "Checkup": "bg-indigo-500",
    "Follow-up": "bg-emerald-500",
    "Consultation": "bg-amber-500",
    "Emergency": "bg-red-500"
  };
  
  return (
    <div>
      {Object.entries(data).map(([type, count]) => (
        <div key={type} className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">{type}</span>
            <span className="text-sm text-gray-500">{Math.round((count / total) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div 
              className={`${colors[type] || "bg-indigo-500"} h-2.5 rounded-full`} 
              style={{ width: `${(count / total) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Recent Medical Reports Component
const RecentReports = ({ medicalReports }: RecentReportsProps) => {
  if (medicalReports.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500">
        <FileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
        <p>No medical reports found.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {medicalReports.map(report => (
        <div key={report.id} className="p-4 hover:bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{report.name}</h3>
              <p className="text-sm text-gray-500">
                {report.patient.name} • {new Date(report.date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                report.status === 'READY' ? 'bg-green-100 text-green-800' : 
                report.status === 'REVIEWED' ? 'bg-blue-100 text-blue-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}>
                {report.status}
              </span>
            </div>
          </div>
          <div className="mt-1 text-sm">
            <span className="inline-block px-2 py-1 bg-gray-100 rounded text-gray-800 text-xs">
              {report.type}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};