// /api/tests/results/[id].ts
import { NextResponse } from 'next/server';
import { PrismaClient, ReportStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const appointmentId =await params.id;
    
    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }
    
    // First, get the appointment details to find the patient and doctor
    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
      select: {
        patientId: true,
        doctorId: true,
        patient: {
          select: {
            name: true,
          },
        },
        doctor: {
          select: {
            name: true,
          },
        },
      },
    });
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }
    
    // Find the most recent medical report for this patient from this doctor
    const report = await prisma.medicalReport.findFirst({
      where: {
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
      },
      include: {
        testRequest: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
    
    if (!report) {
      return NextResponse.json(
        { message: 'No medical reports found for this appointment' },
        { status: 200 }  // Return 200 with empty data rather than 404
      );
    }
    
    // Find related reports for the same patient from the same doctor
    const relatedReports = await prisma.medicalReport.findMany({
      where: {
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        id: {
          not: report.id, // Exclude the current report
        },
        // Only include reports from the last 30 days
        date: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      include: {
        testRequest: true,
      },
      orderBy: {
        date: 'desc'
      },
      take: 5, // Limit to 5 recent reports
    });
    
    // Find test requests that have been requested but don't have reports yet
    const pendingTestRequests = await prisma.testRequest.findMany({
      where: {
        patientId: appointment.patientId,
        requestedBy: appointment.doctorId,
        resultId: null, // Tests that don't have results yet
        status: {
          in: ['REQUESTED', 'PENDING']
        }
      },
      orderBy: {
        requestDate: 'desc'
      },
    });
    
    // Format the current report
    const formattedReport = report ? {
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
      testRequest: report.testRequest ? {
        id: report.testRequest.id,
        testName: report.testRequest.testName,
        description: report.testRequest.description || 'No description available'
      } : null
    } : null;
    
    // Format the related reports
    const formattedRelatedReports = relatedReports.map(relReport => ({
      id: relReport.id,
      name: relReport.name,
      type: relReport.type,
      fileUrl: relReport.fileUrl,
      date: relReport.date,
      status: relReport.status,
      testRequest: relReport.testRequest ? {
        id: relReport.testRequest.id,
        testName: relReport.testRequest.testName,
        description: relReport.testRequest.description || 'No description available'
      } : null
    }));
    
    // Format pending test requests
    const formattedPendingTests = pendingTestRequests.map(test => ({
      id: test.id,
      testName: test.testName,
      testType: test.testType,
      description: test.description || 'No description available',
      status: test.status,
      requestDate: test.requestDate
    }));
    
    return NextResponse.json({
      appointmentId,
      patientId: appointment.patientId,
      patientName: appointment.patient.name,
      doctorId: appointment.doctorId,
      doctorName: appointment.doctor.name,
      report: formattedReport,
      relatedReports: formattedRelatedReports,
      pendingTests: formattedPendingTests
    });
    
  } catch (error) {
    console.error('Error fetching medical reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medical reports' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Add a PUT endpoint to update report status, useful for when viewing PDFs
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const reportId = params.id;
    
    if (!reportId) {
      return NextResponse.json(
        { error: 'Report ID is required' },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    const { status } = data;
    
    // Update the report status (e.g., from PROCESSING to VIEWED)
    const updatedReport = await prisma.medicalReport.update({
      where: {
        id: reportId,
      },
      data: {
        status: status as ReportStatus,
      },
    });
    
    return NextResponse.json({
      success: true,
      report: updatedReport
    });
    
  } catch (error) {
    console.error('Error updating medical report:', error);
    return NextResponse.json(
      { error: 'Failed to update medical report' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}