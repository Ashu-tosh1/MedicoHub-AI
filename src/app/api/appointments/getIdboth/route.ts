import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { appointmentId } = await req.json(); // Get appointmentId from request body

    if (!appointmentId) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 });
    }

    // Find the appointment and retrieve both patientId and doctorId
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      select: { 
        patientId: true,  // Fetch the patientId
        doctorId: true,   // Fetch the doctorId
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Return the patientId and doctorId
    return NextResponse.json({ patientId: appointment.patientId, doctorId: appointment.doctorId }, { status: 200 });
  } catch (error) {
    console.error('Error fetching patient and doctor IDs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
