// app/api/videocall/appointments/route.ts

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

    let appointments: ({ doctor: { name: string; department: string; }; } & { id: string; type: string; time: string; status: $Enums.AppointmentStatus; patientId: string; doctorId: string; date: Date; symptoms: string | null; notes: string | null; })[] | ({ patient: { name: string; }; } & { id: string; type: string; time: string; status: $Enums.AppointmentStatus; patientId: string; doctorId: string; date: Date; symptoms: string | null; notes: string | null; })[] = [];

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
            gte: new Date(),
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
            gte: new Date(),
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

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
