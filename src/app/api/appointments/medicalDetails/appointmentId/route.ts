import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { appointmentId } = await req.json();

    if (!appointmentId) {
      return NextResponse.json({ error: "Missing appointment ID" }, { status: 400 });
    }

    const medicalDetails = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!medicalDetails) {
      return NextResponse.json({ message: "No details found" }, { status: 200 });
    }

    return NextResponse.json(medicalDetails, { status: 200 });
  } catch (error) {
    console.error("Error fetching medical details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
