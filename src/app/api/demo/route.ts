// app/api/patient/dashboard/route.js

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

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
    
    // Fetch patient appointments
    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: patientId,
      },
      include: {
        doctor: {
          select: {
            name: true,
            department: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
    
    // Format the appointments for the frontend
    const formattedAppointments = appointments.map(appointment => ({
      id: appointment.id,
      date: appointment.date.toISOString(),
      time: appointment.time,
      doctor: appointment.doctor.name,
      department: appointment.doctor.department,
      type: appointment.type,
      status: appointment.status,
      notes: appointment.notes,
      symptoms: appointment.symptoms,
    }));
    
    // Get prescriptions with appointment relationship
    // In a real app, we would add appointmentId to the prescription model
    // For now, we'll use the date as a proxy to relate them
    const prescriptions = await prisma.prescription.findMany({
      where: {
        patientId: patientId,
      },
      include: {
        doctor: {
          select: {
            name: true,
          },
        },
        medications: {
          include: {
            medicine: true,
          },
        },
      },
      orderBy: {
        issueDate: 'desc',
      },
    });
    
    // Format prescriptions for frontend
    const formattedPrescriptions = prescriptions.map(prescription => ({
      id: prescription.id,
      issueDate: prescription.issueDate.toISOString(),
      doctor: prescription.doctor.name,
      status: prescription.status,
      medications: prescription.medications.map(med => ({
        name: med.medicine.name,
        dosage: med.dosage, 
        frequency: med.frequency,
        instructions: med.instructions,
      })),
    }));
    
    // Get medical reports
    // Again, in a real app we'd have an appointmentId in the report model
    // For now, we'll use the date as a proxy to relate them
    const medicalReports = await prisma.medicalReport.findMany({
      where: {
        patientId: patientId,
      },
      include: {
        doctor: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
    
    // Format medical reports for frontend
    const formattedReports = medicalReports.map(report => ({
      id: report.id,
      name: report.name,
      type: report.type,
      date: report.date.toISOString(),
      status: report.status,
      doctor: report.doctor.name,
      fileUrl: report.fileUrl,
      results: report.results,
    }));
    
    // Return all data in a single response
    return NextResponse.json({
      appointments: formattedAppointments,
      prescriptions: formattedPrescriptions,
      medicalReports: formattedReports,
    });
    
  } catch (error) {
    console.error("Error fetching patient dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient data" },
      { status: 500 }
    );
  }
}