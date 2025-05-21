import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { appointmentId } = await req.json();

    if (!appointmentId) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
      include: {
        patient: true,
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({
      symptoms: appointment.symptoms,
      notes: appointment.notes,
      patient: appointment.patient,
    });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json({ error: 'Unable to fetch appointment details' }, { status: 500 });
  }
}

