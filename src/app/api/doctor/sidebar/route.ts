// import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { doctor: true },
    });

      if (!user?.doctor) {
        console.log("i am error")
      return NextResponse.json({ error: 'Doctor profile not found' }, { status: 404 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: user.doctor.id },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    return NextResponse.json(doctor);
  } catch (error) {
    console.error('[API] Failed to fetch doctor info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
