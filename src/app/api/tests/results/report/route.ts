// File: /api/tests/results/report.ts
import { NextResponse } from 'next/server';
import { PrismaClient, ReportStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reportId, status } = body;

    if (!reportId) {
      return NextResponse.json(
        { error: 'Report ID is required' },
        { status: 400 }
      );
    }
    if (!status) {
      return NextResponse.json(
        { error: 'Status is required for updating report' },
        { status: 400 }
      );
    }

    const updatedReport = await prisma.medicalReport.update({
      where: { id: reportId },
      data: { status: status as ReportStatus },
    });

    return NextResponse.json({
      success: true,
      report: updatedReport,
    });
  } catch (error) {
    console.error('Error updating report status:', error);
    return NextResponse.json(
      { error: 'Failed to update report status' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
