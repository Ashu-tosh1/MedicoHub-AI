/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { $Enums, PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let appointments: any[] = [];

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    if (user.role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({
        where: { userId: user.id },
      });

      if (!patient) {
        return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
      }

      appointments = await prisma.appointment.findMany({
        where: {
          patientId: patient.id,
          status: 'CONFIRMED',
          date: {
            gte: todayStart,
          },
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
          date: 'asc',
        },
      });
    } else if (user.role === 'DOCTOR') {
      const doctor = await prisma.doctor.findUnique({
        where: { userId: user.id },
      });

      if (!doctor) {
        return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
      }

      appointments = await prisma.appointment.findMany({
        where: {
          doctorId: doctor.id,
          status: 'CONFIRMED',
          date: {
            gte: todayStart,
          },
        },
        include: {
          patient: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          date: 'asc',
        },
      });
    }

    // Ensure all date fields are returned as ISO strings
    const transformedAppointments = appointments.map((appt) => ({
      ...appt,
      date: appt.date.toISOString(),
    }));

    return NextResponse.json({ appointments: transformedAppointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
