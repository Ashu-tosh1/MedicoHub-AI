import Navbar from '@/Components/Homepage/Navbar'
import AppointmentDetails from '@/Components/Patient/Workflow/WorkFlow'
import { requireAuth } from '@/lib/auth';
// import { requireAuth } from '@clerk/clerk-sdk-node';
import React from 'react'

const page = async () => {
  await requireAuth();
  return (
    <div>
     
    <div className="fixed top-0 left-0 w-full z-50">
   <Navbar />
 </div>

 <div className="mt-[54px]"> 
   <AppointmentDetails/>
 </div>
         
   </div>
  )
}

export default page