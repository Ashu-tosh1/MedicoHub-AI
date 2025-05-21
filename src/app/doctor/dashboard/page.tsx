import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
// import prisma from '@/lib/prisma';
import DoctorDashboard from '@/Components/Doctor/DoctorDashboard/DoctorDashboard';
import { requireDoctorAuth } from '@/lib/doctorauth';
import { prisma } from '@/lib/prisma';



// Define TypeScript interfaces
interface Patient {
  id: string;
  name: string;
}

interface Prescription {
  id: string;
  patient: Patient;
}

interface MedicalReport {
  id: string;
  name: string;
  date: string;
  status: string;
  type: string;
  patient: Patient;
}

interface appointment {
  id: string;
  date: string;
  time: string;
  status: string;
  type: string;
  patientId: string;
  patient: Patient;
  symptoms?: string;
  doctor: string; // Added to match the component's expectation
}

interface Doctor {
  id: string;
  name: string;
  department: string;
  experience: number;
  appointments: appointment[];
  availability: { date: string; timeSlots: string[] }[];
  prescriptions: Prescription[];
  medicalReports: MedicalReport[];
  image: string;
  location: string;
  email: string;
  bio: string;
}

interface User {
  id: string;
  clerkId: string;
  doctor: Doctor | null;
}

// Define DoctorWithStats interface with consistent type for appointments
interface DoctorWithStats extends Omit<Doctor, 'availability'> {
  availability: {
    [date: string]: string[];
  };
  stats: {
    todayAppointments: number;
    pendingAppointments: number;
    completedAppointments: number;
    totalPatients: number;
    monthlyAppointments: number[];
    appointmentsByType: Record<string, number>;
  };
}

export default async function DoctorDashboardPage() {
  await requireDoctorAuth()
  const { userId } = await auth();

  if (!userId) {
    return notFound();
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { doctor: true },
    }) as User | null;

    if (!user || !user.doctor) {
      return notFound();
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: user.doctor.id },
      include: {
        appointments: { include: { patient: true } },
        availability: true,
        prescriptions: { include: { patient: true } },
        medicalReports: { include: { patient: true } },
      },
    }) as Doctor | null;

    if (!doctor) return notFound();

    // Convert availability from array to map
    const availabilityByDate: { [date: string]: string[] } = {};
    doctor.availability.forEach((slot) => {
      availabilityByDate[slot.date] = slot.timeSlots;
    });

    // Stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const todayAppointments = doctor.appointments.filter(
      (apt) => new Date(apt.date).toDateString() === today.toDateString()
    );

    const pendingAppointments = doctor.appointments.filter(
      (apt) => apt.status === 'PENDING'
    );

    const completedThisWeek = doctor.appointments.filter(
      (apt) => apt.status === 'COMPLETED' && new Date(apt.date) >= lastWeek
    );

    const uniquePatientIds = new Set(
      doctor.appointments.map((apt) => apt.patientId)
    );

    const appointmentsByType = doctor.appointments.reduce<Record<string, number>>((acc, apt) => {
      acc[apt.type] = (acc[apt.type] || 0) + 1;
      return acc;
    }, {});

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const monthlyAppointments = Array(30).fill(0);
    doctor.appointments.forEach((apt) => {
      const aptDate = new Date(apt.date);
      const diffTime = today.getTime() - aptDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 30) {
        monthlyAppointments[29 - diffDays]++;
      }
    });

    // Construct the DoctorWithStats object
    const doctorWithStats: DoctorWithStats = {
      ...doctor,
      availability: availabilityByDate,
      stats: {
        todayAppointments: todayAppointments.length,
        pendingAppointments: pendingAppointments.length,
        completedAppointments: completedThisWeek.length,
        totalPatients: uniquePatientIds.size,
        monthlyAppointments,
        appointmentsByType,
      },
    };

    return <DoctorDashboard doctor={doctorWithStats} />;
  } catch (error) {
    console.error('Error loading doctor dashboard:', error);
    return <div>Error loading doctor dashboard</div>;
  }
}