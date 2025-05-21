import { NextResponse } from 'next/server';
import { PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { appointmentId } = body;

    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    // Fetch appointment details
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      select: {
        patientId: true,
        doctorId: true,
        patient: { select: { name: true } },
        doctor: { select: { name: true } },
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Most recent report
    const report = await prisma.medicalReport.findFirst({
      where: {
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
      },
      include: { testRequest: true },
      orderBy: { date: 'desc' },
    });

    if (!report) {
      return NextResponse.json(
        { message: 'No medical reports found for this appointment' },
        { status: 200 }
      );
    }

    // Related reports in last 30 days (excluding current)
    const relatedReports = await prisma.medicalReport.findMany({
      where: {
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        id: { not: report.id },
        date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
      include: { testRequest: true },
      orderBy: { date: 'desc' },
      take: 5,
    });

    // Pending test requests
    const pendingTestRequests = await prisma.testRequest.findMany({
      where: {
        patientId: appointment.patientId,
        requestedBy: appointment.doctorId,
        resultId: null,
        status: { in: ['REQUESTED', 'PENDING'] },
      },
      orderBy: { requestDate: 'desc' },
    });

    // Format response
    const formattedReport = report
      ? {
          id: report.id,
          name: report.name,
          type: report.type,
          fileUrl: report.fileUrl,
          results: report.results,
          date: report.date,
          status: report.status,
          patientName: appointment.patient.name,
          patientId: appointment.patientId,
          doctorName: appointment.doctor.name,
          doctorId: appointment.doctorId,
          testRequest: report.testRequest
            ? {
                id: report.testRequest.id,
                testName: report.testRequest.testName,
                description: report.testRequest.description || 'No description available',
              }
            : null,
        }
      : null;

    const formattedRelatedReports = relatedReports.map((relReport) => ({
      id: relReport.id,
      name: relReport.name,
      type: relReport.type,
      fileUrl: relReport.fileUrl,
      date: relReport.date,
      status: relReport.status,
      testRequest: relReport.testRequest
        ? {
            id: relReport.testRequest.id,
            testName: relReport.testRequest.testName,
            description: relReport.testRequest.description || 'No description available',
          }
        : null,
    }));

    const formattedPendingTests = pendingTestRequests.map((test) => ({
      id: test.id,
      testName: test.testName,
      testType: test.testType,
      description: test.description || 'No description available',
      status: test.status,
      requestDate: test.requestDate,
    }));

    return NextResponse.json({
      appointmentId,
      patientId: appointment.patientId,
      patientName: appointment.patient.name,
      doctorId: appointment.doctorId,
      doctorName: appointment.doctor.name,
      report: formattedReport,
      relatedReports: formattedRelatedReports,
      pendingTests: formattedPendingTests,
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}