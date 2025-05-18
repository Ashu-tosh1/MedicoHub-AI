import Navbar from '@/Components/Homepage/Navbar'
import PatientProfile from '@/Components/Patient/PatientProfile/PatientProfile'
import React from 'react'

const page = () => {
  return (
    <div>
     
    <div className="fixed top-0 left-0 w-full z-50">
   <Navbar />
 </div>

 <div className="mt-[54px]"> 
   <PatientProfile/>
 </div>
         
   </div>
  )
}

export default page