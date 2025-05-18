/* eslint-disable @typescript-eslint/no-unused-vars */

import prisma from '@/lib/prisma'; // Assuming you have Prisma set up
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Fetch confirmed appointments, including the patient and appointment details
    const confirmedAppointments = await prisma.appointment.findMany({
      where: {
        status: 'CONFIRMED', // Assuming you have an appointment status field
      },
      include: {
        patient: true, // Assuming there is a relationship between Appointment and Patient
      },
    });

    // Map the result to include both patient details and the appointment ID
    const patientsWithAppointmentId = confirmedAppointments.map((appointment) => ({
      appointmentId: appointment.id, // Get the appointment ID
      ...appointment.patient, // Spread patient details
    }));

    // Return the patients along with appointment ID in the response
    return NextResponse.json(patientsWithAppointmentId);
  } catch (error) {
    // Return error message if something goes wrong
    return new NextResponse(
      JSON.stringify({ error: 'Unable to fetch confirmed appointments' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
