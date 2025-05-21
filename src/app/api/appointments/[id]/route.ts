/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/api/appointments/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ResponseData = {
  error?: string;
  [key: string]: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const appointmentId = Array.isArray(id) ? id[0] : id;

    if (!appointmentId) {
      return res.status(400).json({ error: 'Appointment ID is required' });
    }

    // Fetch the appointment with related data
    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
      include: {
        patient: true,
        doctor: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Format the date and time for frontend display
    const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    // Find any medical reports related to this patient and doctor
    const medicalReports = await prisma.medicalReport.findMany({
      where: {
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Find any test requests related to this patient
    const testRequests = await prisma.testRequest.findMany({
      where: {
        patientId: appointment.patientId,
        requestedBy: appointment.doctorId,
      },
      include: {
        medicalReport: true,
      },
    });

    // Find any prescriptions related to this patient and doctor
    const prescriptions = await prisma.prescription.findMany({
      where: {
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
      },
      include: {
        medications: {
          include: {
            medicine: true,
          },
        },
      },
      orderBy: {
        issueDate: 'desc',
      },
      take: 1, // Get the most recent prescription
    });

    // Find any doctor notes related to this patient
    const doctorNotes = await prisma.doctorNote.findMany({
      where: {
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 3, // Get the most recent notes
    });

    // Find patient symptoms
    const patientSymptoms = await prisma.patientSymptom.findMany({
      where: {
        patientId: appointment.patientId,
      },
      orderBy: {
        reportedAt: 'desc',
      },
      take: 5, // Get the most recent symptoms
    });

    // Find AI diagnoses related to patient symptoms
    const aiDiagnoses = await prisma.aIDiagnosis.findMany({
      where: {
        patientId: appointment.patientId,
      },
      orderBy: {
        generatedAt: 'desc',
      },
      take: 1, // Get the most recent AI diagnosis
    });

    // Format the response data for the frontend
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

    // Add recommended tests based on test requests
    const recommendedTests = testRequests.map(test => ({
      name: test.testName,
      description: test.description || `${test.testType} - Requested by Dr. ${appointment.doctor.name}`,
      status: test.status,
      resultId: test.resultId,
    }));

    // Add test results from medical reports
    const testResults = medicalReports.length > 0 
      ? medicalReports[0].results 
      : null;

    // Add medications from prescriptions
    let medications: any[] = [];
    
    if (prescriptions.length > 0 && prescriptions[0].medications.length > 0) {
      medications = prescriptions[0].medications.map(med => ({
        name: med.medicine.name,
        dosage: med.dosage,
        instructions: med.instructions || `Take ${med.frequency} for ${med.duration || 'as needed'}`,
      }));
    }

    // Format doctor notes
    const formattedDoctorNotes = doctorNotes.map(note => ({
      id: note.id,
      title: note.title || 'Untitled Note',
      content: note.content,
      type: note.noteType,
      createdAt: note.createdAt.toISOString(),
    }));

    // Format patient symptoms
    const formattedSymptoms = patientSymptoms.map(symptom => ({
      id: symptom.id,
      symptom: symptom.symptom,
      severity: symptom.severity,
      duration: symptom.duration,
      description: symptom.description,
      reportedAt: symptom.reportedAt.toISOString(),
    }));

    // Format AI diagnoses
    const formattedDiagnoses = aiDiagnoses.length > 0 ? {
      possibleDiseases: aiDiagnoses[0].possibleDiseases,
      urgencyLevel: aiDiagnoses[0].urgencyLevel,
      confidenceScore: aiDiagnoses[0].confidenceScore,
      recommendations: aiDiagnoses[0].recommendations,
      furtherTestsRecommended: aiDiagnoses[0].furtherTestsRecommended,
      generatedAt: aiDiagnoses[0].generatedAt.toISOString(),
    } : null;

    return res.status(200).json({
      ...formattedAppointment,
      recommendedTests: recommendedTests.length > 0 ? recommendedTests : null,
      testResults,
      medications: medications.length > 0 ? medications : null,
      doctorNotes: formattedDoctorNotes.length > 0 ? formattedDoctorNotes : null,
      patientSymptoms: formattedSymptoms.length > 0 ? formattedSymptoms : null,
      aiDiagnosis: formattedDiagnoses,
    });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return res.status(500).json({ error: 'Failed to fetch appointment details' });
  } finally {
    await prisma.$disconnect();
  }
}