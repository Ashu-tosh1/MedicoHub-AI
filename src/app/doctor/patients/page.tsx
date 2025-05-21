// import DoctorDashboard from '@/Components/Doctor/PatientSection/PatientList'
import PatientSection from '@/Components/Doctor/PatientSection/PatientList'
import { requireDoctorAuth } from '@/lib/doctorauth'
import React from 'react'

const page =async () => {

  await requireDoctorAuth()
  return (
      <div>
           <PatientSection/>
    </div>
  )
}

export default page