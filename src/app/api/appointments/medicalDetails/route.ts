import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const { appointmentId, symptoms, notes } = await req.json();

    if (!appointmentId) {
      return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 });
    }

    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        symptoms,
        notes,
        
      },
    });

    return NextResponse.json({ message: "Updated successfully", appointment: updated }, { status: 200 });
  } catch (error) {
    console.error("Error updating medical details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
