/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const appointmentId = body.appointmentId;

    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: true,
        doctor: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const [medicalReports, testRequests, prescriptions, doctorNotes, patientSymptoms, aiDiagnoses] = await Promise.all([
      prisma.medicalReport.findMany({
        where: {
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
        },
        orderBy: { date: 'desc' },
      }),
      prisma.testRequest.findMany({
        where: {
          patientId: appointment.patientId,
          requestedBy: appointment.doctorId,
        },
        include: { medicalReport: true },
      }),
      prisma.prescription.findMany({
        where: {
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
        },
        include: {
          medications: { include: { medicine: true } },
        },
        orderBy: { issueDate: 'desc' },
        take: 1,
      }),
      prisma.doctorNote.findMany({
        where: {
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
        },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),
      prisma.patientSymptom.findMany({
        where: { patientId: appointment.patientId },
        orderBy: { reportedAt: 'desc' },
        take: 5,
      }),
      prisma.aIDiagnosis.findMany({
        where: { patientId: appointment.patientId },
        orderBy: { generatedAt: 'desc' },
        take: 1,
      }),
    ]);

    const formattedAppointment = {
      id: appointment.id,
      patientName: appointment.patient.name,
      doctorName: appointment.doctor.name,
      doctorSpecialty: appointment.doctor.department,
      appointmentDate: formattedDate,
      appointmentTime: appointment.time,
      location: appointment.doctor.location,
      status: appointment.status.toLowerCase(),
      type: appointment.type,
      symptoms: appointment.symptoms ? appointment.symptoms.split(',').map(s => s.trim()) : [],
      notes: appointment.notes,
    };

    const recommendedTests = testRequests.map(test => ({
      name: test.testName,
      description: test.description || `${test.testType} - Requested by Dr. ${appointment.doctor.name}`,
      status: test.status,
      resultId: test.resultId,
    }));

    const testResults = medicalReports.length > 0 ? medicalReports[0].results : null;

    let medications: any[] | null = [];
    if (prescriptions.length > 0 && prescriptions[0].medications.length > 0) {
      medications = prescriptions[0].medications.map(med => ({
        name: med.medicine.name,
        dosage: med.dosage,
        instructions: med.instructions || `Take ${med.frequency} for ${med.duration || 'as needed'}`,
      }));
    }

    const formattedDoctorNotes = doctorNotes.map(note => ({
      id: note.id,
      title: note.title || 'Untitled Note',
      content: note.content,
      type: note.noteType,
      createdAt: note.createdAt.toISOString(),
    }));

    const formattedSymptoms = patientSymptoms.map(symptom => ({
      id: symptom.id,
      symptom: symptom.symptom,
      severity: symptom.severity,
      duration: symptom.duration,
      description: symptom.description,
      reportedAt: symptom.reportedAt.toISOString(),
    }));

    const formattedDiagnoses = aiDiagnoses.length > 0 ? {
      possibleDiseases: aiDiagnoses[0].possibleDiseases,
      urgencyLevel: aiDiagnoses[0].urgencyLevel,
      confidenceScore: aiDiagnoses[0].confidenceScore,
      recommendations: aiDiagnoses[0].recommendations,
      furtherTestsRecommended: aiDiagnoses[0].furtherTestsRecommended,
      generatedAt: aiDiagnoses[0].generatedAt.toISOString(),
    } : null;

    return NextResponse.json({
      ...formattedAppointment,
      recommendedTests: recommendedTests.length > 0 ? recommendedTests : null,
      testResults,
      medications: medications && medications.length > 0 ? medications : null,
      doctorNotes: formattedDoctorNotes.length > 0 ? formattedDoctorNotes : null,
      patientSymptoms: formattedSymptoms.length > 0 ? formattedSymptoms : null,
      aiDiagnosis: formattedDiagnoses,
    });

  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment details' },
      { status: 500 }
    );
  }
}
