import Navbar from '@/Components/Homepage/Navbar'
import AppointmentDetails from '@/Components/Patient/Workflow/WorkFlow'
import React from 'react'

const page = () => {
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