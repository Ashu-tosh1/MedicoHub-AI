/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
// import { Prescriptions } from '@/lib/mockData';


  


export async function GET() {
  try {
    const { userId } = await auth();
    
    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the user in our database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { patient: true }
    });

    if (!user || !user.patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Fetch patient data
    const patientId = user.patient.id;

    // Get upcoming appointments
    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        patientId,
        date: { gte: new Date() },
        status: { in: ['PENDING', 'CONFIRMED'] }
      },
      include: {
        doctor: true
      },
      orderBy: {
        date: 'asc'
      },
      take: 3 // Limit to 3 upcoming appointments
    });

    // Get recent medical reports
    const recentReports = await prisma.medicalReport.findMany({
      where: {
        patientId
      },
      include: {
        doctor: true
      },
      orderBy: {
        date: 'desc'
      },
      take: 3 // Limit to 3 recent reports
    });

    // Get active prescriptions and conversation medications
    // const activePrescriptions = await prisma.prescription.findMany({
    //   where: {
    //     patientId,
    //     status: 'ACTIVE'
    //   },
    //   include: {
    //     doctor: true,
        
    //   },
    //   orderBy: {
    //     issueDate: 'desc'
    //   }
    // });

    // Format the data to match frontend expectations
    const formattedAppointments = upcomingAppointments.map(appointment => ({
      id: appointment.id,
      doctor: appointment.doctor.name,
      department: appointment.doctor.department,
      date: appointment.date.toLocaleDateString(),
      time: appointment.time,
      status: appointment.status === 'CONFIRMED' ? 'Confirmed' : 'Pending'
    }));

    const formattedReports = recentReports.map(report => ({
      id: report.id,
      name: report.name,
      date: report.date.toLocaleDateString(),
      status: report.status === 'READY' ? 'Ready' : 'Processing'
    }));

    // Flatten prescription conversation medications for the frontend
    const formattedPrescriptions: { id: string; medication: string; dosage: string; frequency: string; status: string; prescriptionId: string; }[] = [];
    // activePrescriptions.forEach(prescription => {
    // //   prescription.forEach((medication: { id: any; medicine: { name: any; }; dosage: any; frequency: any; }) => {
    // //     formattedPrescriptions.push({
    // //       id: medication.id,
    // //       medication: medication.medicine.name,
    // //       dosage: medication.dosage,
    // //       frequency: medication.frequency,
    // //       status: 'Active',
    // //       prescriptionId: prescription.id
    // //     });
    // //   });
    // });

    // Return the formatted data
    return NextResponse.json({
      patientName: user.patient.name,
      nextAppointment: formattedAppointments[0] || null,
      upcomingAppointments: formattedAppointments,
      recentReports: formattedReports,
      prescriptions: formattedPrescriptions
    });

  } catch (error) {
    console.error('Error fetching patient dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
