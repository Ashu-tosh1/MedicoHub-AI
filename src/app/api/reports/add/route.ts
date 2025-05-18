// pages/api/reports/add.ts

import prisma from "@/lib/prisma";
import { ReportType } from "@prisma/client";
import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { appointmentId, name, type, fileUrl, results } = await req.json();

    if (!appointmentId || !name || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      select: { patientId: true, doctorId: true },
    });

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    const report = await prisma.medicalReport.create({
      data: {
        id: appointmentId,
        name,
        type:ReportType.OTHER,
        fileUrl,
        results,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error("[REPORT_UPLOAD_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
