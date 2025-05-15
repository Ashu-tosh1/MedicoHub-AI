import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { appointmentId, status } = await req.json();

    if (!appointmentId || !status) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const upperStatus = status.toUpperCase();

    // Validate status
    if (!['CONFIRMED', 'CANCELLED'].includes(upperStatus)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Fetch the appointment
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Update appointment status
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: upperStatus },
    });

    // If confirmed, delete the corresponding availability slot
    if (upperStatus === 'CONFIRMED') {
      await prisma.doctorAvailability.deleteMany({
        where: {
          doctorId: appointment.doctorId,
          date: appointment.date,
          timeSlot: appointment.time, // corrected from `time` to `timeSlot`
        },
      });
    }

    return NextResponse.json({
      message: 'Appointment updated successfully',
      appointment: updatedAppointment,
    });

  } catch (error) {
    console.error('[UPDATE_APPOINTMENT_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
