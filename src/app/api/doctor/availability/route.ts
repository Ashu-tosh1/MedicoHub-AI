import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { doctorId } = body;

    if (!doctorId) {
      return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
    }

    const availability = await prisma.doctorAvailability.findMany({
      where: {
        doctorId,
      },
      select: {
        date: true,
        timeSlot: true,
        isBooked: true,
      },
    });

    if (!availability.length) {
      return NextResponse.json({ error: 'Availability not found for this doctor.' }, { status: 404 });
    }

    const formattedAvailability: Record<string, string[]> = {};

    availability.forEach(({ date, timeSlot }) => {
      const formattedDate = date.toISOString().split('T')[0];
      if (!formattedAvailability[formattedDate]) {
        formattedAvailability[formattedDate] = [];
      }
      formattedAvailability[formattedDate].push(timeSlot);
    });

    return NextResponse.json(formattedAvailability, { status: 200 });
  } catch (error) {
    console.error('Error fetching doctor availability:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
