import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { clerkUserId } = await request.json();

    // Step 1: Find user by Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Step 2: Use the user's internal ID to find the patient
    const patient = await prisma.patient.findUnique({
      where: { userId: user.id },
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json({ patientId: patient.id }, { status: 200 });
  } catch (error) {
    console.error('Error fetching patient ID:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
