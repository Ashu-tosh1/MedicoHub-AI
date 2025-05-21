/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAppointmentDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatAppointmentTime(time: string): string {
  // Assuming time is in HH:MM format
  const [hours, minutes] = time.split(':').map(Number);
  
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  
  return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function groupAppointmentsByDate(appointments: any[]): Record<string, any[]> {
  const grouped: Record<string, any[]> = {};
  
  appointments.forEach(appointment => {
    const dateStr = formatAppointmentDate(appointment.date);
    
    if (!grouped[dateStr]) {
      grouped[dateStr] = [];
    }
    
    grouped[dateStr].push(appointment);
  });
  
  return grouped;
}

export const formatShortDate = (dateString: string): string => {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    
    // Get month, day, and year
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    // Return formatted date
    return `${month}/${day}/${year}`;
  } catch (error) {
    console.error("Error formatting short date:", error);
    return "Error";
  }
};