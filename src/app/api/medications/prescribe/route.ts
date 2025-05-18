/* eslint-disable @typescript-eslint/no-explicit-any */
// /api/medications/prescribe.ts
import { NextResponse } from 'next/server';
import { PrismaClient, PrescriptionStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientId, doctorId, medications } = body;
    
    if (!patientId || !doctorId || !medications || !Array.isArray(medications) || medications.length === 0) {
      return NextResponse.json(
        { error: 'Patient ID, Doctor ID, and at least one medication are required' },
        { status: 400 }
      );
    }
    
    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Create a prescription record
      const prescription = await tx.prescription.create({
        data: {
          patientId,
          doctorId,
          issueDate: new Date(),
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          status: PrescriptionStatus.ACTIVE
        }
      });
      
      // Process each medication
      const medicationPromises = medications.map(async (med: any) => {
        // Check if medicine exists, create if not
        let medicine = await tx.medicine.findFirst({
          where: {
            name: {
              equals: med.name,
              mode: 'insensitive'
            }
          }
        });
        
        if (!medicine) {
          medicine = await tx.medicine.create({
            data: {
              name: med.name,
              genericName: med.genericName || null,
              description: med.description || `${med.name} ${med.dosage}`,
              dosageForm: med.dosageForm || null,
              strength: med.dosage || null,
              category: med.category || null
            }
          });
        }
        
        // Create prescription medication entry
        const prescriptionMedication = await tx.prescriptionMedication.create({
          data: {
            prescriptionId: prescription.id,
            medicineId: medicine.id,
            dosage: med.dosage || '1 tablet',
            frequency: med.frequency || 'As directed',
            duration: med.duration || 'As needed',
            instructions: med.instructions || null,
          }
        });
        
        return {
          id: prescriptionMedication.id,
          medicineId: medicine.id,
          medicineName: medicine.name,
          dosage: prescriptionMedication.dosage,
          frequency: prescriptionMedication.frequency,
          duration: prescriptionMedication.duration,
          instructions: prescriptionMedication.instructions,
        };
      });
      
      // Wait for all medications to be processed
      const createdMedications = await Promise.all(medicationPromises);
      
      // Get the complete prescription with medications
      const completePrescription = await tx.prescription.findUnique({
        where: {
          id: prescription.id
        },
        include: {
          medications: {
            include: {
              medicine: true
            }
          },
          patient: {
            select: {
              name: true
            }
          },
          doctor: {
            select: {
              name: true,
              department: true
            }
          }
        }
      });
      
      if (!completePrescription) {
        throw new Error('Failed to retrieve created prescription');
      }
      
      return {
        prescription: {
          id: completePrescription.id,
          issueDate: completePrescription.issueDate,
          expiryDate: completePrescription.expiryDate,
          status: completePrescription.status,
          patientName: completePrescription.patient.name,
          doctorName: completePrescription.doctor.name,
          doctorDepartment: completePrescription.doctor.department
        },
        medications: createdMedications
      };
    });
    
    return NextResponse.json({
      success: true,
      message: 'Prescription created successfully',
      data: result
    });
    
  } catch (error) {
    console.error('Error prescribing medications:', error);
    
    // Provide more specific error messages for common issues
    // if (error.code === 'P2002') {
    //   return NextResponse.json(
    //     { error: 'Duplicate entry found. This prescription may already exist.' },
    //     { status: 400 }
    //   );
    // } else if (error.code === 'P2003') {
    //   return NextResponse.json(
    //     { error: 'Invalid patient or doctor ID provided.' },
    //     { status: 400 }
    //   );
    // }
    
    return NextResponse.json(
      { error: 'Failed to prescribe medications' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}