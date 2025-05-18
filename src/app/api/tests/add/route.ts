import prisma from "@/lib/prisma";
import { ReportType } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patientId, doctorId, tests } = body;

    if (!patientId || !doctorId || !Array.isArray(tests)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Create test requests directly
    const createdTestRequests = await Promise.all(
      tests.map((test: { testName: string; testType: ReportType; description?: string }) =>
        prisma.testRequest.create({
          data: {
            patientId,
            requestedBy: doctorId,
            testName: test.testName,
            testType: test.testType,
            description: test.description,
            status: "REQUESTED", // default, but explicit for clarity
          },
        })
      )
    );

    return NextResponse.json({ success: true, testRequests: createdTestRequests }, { status: 200 });

  } catch (error) {
    console.error("Error creating test requests:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
