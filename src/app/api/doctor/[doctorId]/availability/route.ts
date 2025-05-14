import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Next.js 15.3.2 route handler
export async function GET(
  request: NextRequest,
  { params }: { params: { doctorId: string } }
) {
  const doctorId = params.doctorId;

  if (!doctorId) {
    return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
  }

  try {
    const availability = await prisma.doctorAvailability.findMany({
      where: {
        doctorId: doctorId,
        isBooked: false, // Only get available slots
      },
      orderBy: {
        date: 'asc',
      },
      select: {
        id: true,
        date: true,
        timeSlot: true,
      },
    });

    if (!availability.length) {
      return NextResponse.json({ error: 'No availability found for this doctor.' }, { status: 404 });
    }

    const formattedAvailability: Record<string, string[]> = {};

    availability.forEach(({ date, timeSlot }) => {
      const formattedDate = date.toISOString().split('T')[0]; // Format to 'YYYY-MM-DD'
      if (!formattedAvailability[formattedDate]) {
        formattedAvailability[formattedDate] = [];
      }
      formattedAvailability[formattedDate].push(timeSlot);
    });

    return NextResponse.json(formattedAvailability);
  } catch (error) {
    console.error('Error fetching doctor availability:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}