import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const clerkId = searchParams.get("clerkId");

  if (!clerkId) {
    return NextResponse.json({ error: "Clerk ID is required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const patient = await prisma.patient.findUnique({
      where: { userId: user.id },
      include: { user: true },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(patient, { status: 200 });
  } catch (error) {
    console.error("Error fetching patient data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
