/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { patient: true },
    });

    if (!user || !user.patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    const patientId = user.patient.id;

    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        patientId,
        date: { gte: new Date() },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
      include: {
        doctor: true,
      },
      orderBy: {
        date: 'asc',
      },
      take: 3,
    });

    const recentReports = await prisma.medicalReport.findMany({
      where: {
        patientId,
      },
      include: {
        doctor: true,
      },
      orderBy: {
        date: 'desc',
      },
      take: 3,
    });

    // Fetch active prescriptions with medications and medicine info
    const activePrescriptions = await prisma.prescription.findMany({
      where: {
        patientId,
        status: 'ACTIVE',
      },
      include: {
        medications: {
          include: {
            medicine: true,
          },
        },
        doctor: true,
      },
      orderBy: {
        issueDate: 'desc',
      },
    });

    // Format appointments
    const formattedAppointments = upcomingAppointments.map((appointment) => ({
      id: appointment.id,
      doctor: appointment.doctor.name,
      department: appointment.doctor.department,
      date: appointment.date.toLocaleDateString(),
      time: appointment.time,
      status: appointment.status === 'CONFIRMED' ? 'Confirmed' : 'Pending',
    }));

    // Format reports
    const formattedReports = recentReports.map((report) => ({
      id: report.id,
      name: report.name,
      date: report.date.toLocaleDateString(),
      status: report.status === 'READY' ? 'Ready' : 'Processing',
    }));

    // Format prescriptions
    const formattedPrescriptions = activePrescriptions.flatMap((prescription) =>
      prescription.medications.map((med) => ({
        id: med.id,
        prescriptionId: prescription.id,
        doctor: prescription.doctor.name,
        medication: med.medicine.name,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration || '',
        instructions: med.instructions || '',
        status: 'Active',
      }))
    );

    return NextResponse.json({
      patientName: user.patient.name,
      nextAppointment: formattedAppointments[0] || null,
      upcomingAppointments: formattedAppointments,
      recentReports: formattedReports,
      prescriptions: formattedPrescriptions,
    });
  } catch (error) {
    console.error('Error fetching patient dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
