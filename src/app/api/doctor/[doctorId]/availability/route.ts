import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


// Handle GET request to fetch availability for a doctor
export async function GET(req: NextRequest, { params }: { params: { doctorId: string } }) {
  const { doctorId } =await params;

  if (!doctorId) {
    return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
  }

  try {
    const availability = await prisma.doctorAvailability.findMany({
      where: {
        doctorId: doctorId,
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

    // Format the availability into a map by date
    const formattedAvailability: Record<string, string[]> = {};

    availability.forEach(({ date, timeSlot }) => {
      const formattedDate = date.toISOString().split('T')[0]; // Format to 'YYYY-MM-DD'
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
