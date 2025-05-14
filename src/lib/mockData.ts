export interface Doctor {
    id: number;
    name: string;
    department: string;
    image: string;
    experience: number;
    location: string;
    email: string;
    bio: string;
    availability: {
      [date: string]: string[]; // date -> available time slots
    };
  }