/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';


const prisma=new PrismaClient()

export async function GET(request: Request) {
    try {
      // Get patientId from the query parameters
      const url = new URL(request.url);
      const patientId = url.searchParams.get('patientId');
  
      console.log("Received patientId:", patientId);  // Log the patientId
  
      if (!patientId) {
        return NextResponse.json({ message: 'Patient ID is required' }, { status: 400 });
      }
  
      const appointments = await prisma.appointment.findMany({
        where: {
          patientId: patientId,  // Corrected to use patientId
        },
        include: {
          doctor: true,
        },
      });
      
  
      const formatted = appointments.map((appt: { id: any; doctor: { name: any; department: any; }; date: any; time: any; status: any; }) => ({
        id: appt.id,
        doctorName: `${appt.doctor.name}`,
        specialization: appt.doctor.department,
        date: appt.date,
        time: appt.time,
        status: appt.status,
      }));
  
      return NextResponse.json(formatted);
  
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }
  
