export interface Doctor {
    id: string;
    name: string;
    department: string;
    image: string;
    experience: number;
    location: string;
    email: string;
  bio: string;
  stats: DoctorStats;
  appointments: Appointment[];
  medicalReports: MedicalReport[];
    availability: {
      [date: string]: string[]; // date -> available time slots
    };
}


  
export   interface report{
  name: string;
  date: number;
  id: number;
  status: string;
}

export interface Prescriptions{
  id: number;
  medication:string
  dosage:string
  frequency: string
  status: string

}
export type appointment = {
  id: string;
  patient: Patient;
  patientId: string;
  doctor: string;
  department: string;
  time: string;
  date: string;
  status: string;
  type: string;
  symptoms?: string;
};


interface Patient {
  name: string;
}

interface Appointment {
  date: string | number | Date;

 
  type: string;
  status: string;

}

export  interface MedicalReport {
  id: string;
  name: string;
  patient: Patient;
  date: string;
  status: string;
  type: string;
}

interface DoctorStats {
  todayAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  totalPatients: number;
  monthlyAppointments: number[];
  appointmentsByType: Record<string, number>;
}


// types/medicine.ts
export interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  manufacturer?: string;
  category?: string;
  description?: string;
  dosageForm?: string;
  strength?: string;
  price?: number; // You might want to add this from InventoryItem
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export interface PrescriptionMedication {
  id: string;
  medicineId: string;
  dosage: string;
  frequency: string;
  duration?: string;
  instructions?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  issueDate: string;
  expiryDate?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'EXPIRED';
  medications: PrescriptionMedication[];
}

export interface Order {
  userId: string;
  items: CartItem[];
  address: string;
  phoneNumber: string;
  totalAmount: number;
}