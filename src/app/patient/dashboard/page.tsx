import Navbar from '@/Components/Homepage/Navbar'
import PatientDashboard from '@/Components/Patient/Dashboard/Dashboard'
import React from 'react'

const page = () => {
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