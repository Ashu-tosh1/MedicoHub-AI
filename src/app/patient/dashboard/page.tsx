import Navbar from '@/Components/Homepage/Navbar'
import PatientDashboard from '@/Components/Patient/Dashboard/Dashboard'
import { requireAuth } from '@/lib/auth';
// import { requireAuth } from '@clerk/clerk-sdk-node';
import React from 'react'

const page = async () => {
  await requireAuth();
  // await re
  return (
    <div>
     
     <div className="fixed top-0 left-0 w-full z-50">
    <Navbar />
  </div>

  <div className="mt-[54px]"> 
    <PatientDashboard/>
  </div>
          
    </div>
  )
}

export default page