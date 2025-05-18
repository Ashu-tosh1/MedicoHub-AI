import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { appointmentId, userId } = body;

    if (!appointmentId || !userId) {
      return NextResponse.json({ error: 'Appointment ID and User ID are required' }, { status: 400 });
    }

    // Fetch the appointment and include user clerk IDs
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    if (appointment.status !== 'CONFIRMED') {
      return NextResponse.json(
        { error: 'Cannot join call for non-confirmed appointment' },
        { status: 400 }
      );
    }

    let displayName = '';

    // Verify the user is either patient or doctor
    if (appointment.patient.user.clerkId === userId) {
      displayName = appointment.patient.name;
    } else if (appointment.doctor.user.clerkId === userId) {
      displayName = appointment.doctor.name;
    } else {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const callInfo = {
      roomName: `appointment-${appointmentId}`,
      displayName,
      appointmentDetails: {
        id: appointment.id,
        date: appointment.date,
        time: appointment.time,
        patientName: appointment.patient.name,
        doctorName: appointment.doctor.name,
      },
    };

    return NextResponse.json(callInfo);
  } catch (error) {
    console.error('Error generating call info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
