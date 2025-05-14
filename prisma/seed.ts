/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient, UserRole } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding doctors and availability...');

  // Create doctor users
  const doctorUsers = await createDoctors(10);

  // Create doctor availability for next 2 months
  await createDoctorAvailabilityForTwoMonths(doctorUsers.map(d => d.doctor));

  console.log('Doctor seeding completed successfully!');
}

async function createUser(clerkId: string, email: string, firstName: string, lastName: string, role: UserRole) {
  const user = await prisma.user.create({
    data: {
      clerkId,
      email,
      firstName,
      lastName,
      role
    }
  });
  
  console.log(`Created user: ${user.email} with role: ${user.role}`);
  return user;
}

async function createDoctors(count: number) {
  console.log(`Creating ${count} doctors...`);
  
  const doctors = [];
  const departments = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Gynecology', 'Ophthalmology', 'ENT'];
  const locations = ['Building A', 'Building B', 'East Wing', 'West Wing', 'Main Campus'];
  
  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    const clerkId = `doc_${faker.string.uuid()}`;
    
    const user = await createUser(clerkId, email, firstName, lastName, UserRole.DOCTOR);
    
    const doctor = await prisma.doctor.create({
      data: {
        userId: user.id,
        name: `Dr. ${firstName} ${lastName}`,
        department: faker.helpers.arrayElement(departments),
        experience: faker.number.int({ min: 1, max: 30 }),
        location: faker.helpers.arrayElement(locations),
        email: email,
        bio: faker.lorem.paragraph(),
        image: faker.image.avatar()
      }
    });
    
    console.log(`Created doctor: ${doctor.name} in ${doctor.department}`);
    doctors.push({ user, doctor });
  }
  
  return doctors;
}

async function createDoctorAvailabilityForTwoMonths(doctors: any[]) {
  console.log('Creating doctor availability for the next 2 months...');
  
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];
  
  // Calculate start and end dates (2 months period)
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 2);
  endDate.setHours(23, 59, 59, 999);
  
  for (const doctor of doctors) {
    console.log(`Creating availability slots for Dr. ${doctor.name}`);
    
    // Loop through each day for the next 2 months
    const currentDate = new Date(startDate);
    let slotsCreated = 0;
    
    while (currentDate <= endDate) {
      // Skip weekends (0 = Sunday, 6 = Saturday)
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Each doctor has 5-8 slots per weekday
        const dailySlots = faker.helpers.arrayElements(
          timeSlots, 
          faker.number.int({ min: 5, max: 8 })
        );
        
        for (const timeSlot of dailySlots) {
          await prisma.doctorAvailability.create({
            data: {
              doctorId: doctor.id,
              date: new Date(currentDate),
              timeSlot: timeSlot,
              isBooked: false // Default to available slots
            }
          });
          slotsCreated++;
        }
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    console.log(`Created ${slotsCreated} availability slots for Dr. ${doctor.name}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });