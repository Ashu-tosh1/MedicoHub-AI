import VideoCalls from '@/Components/VideoCall/VideoCall'
import { requireDoctorAuth } from '@/lib/doctorauth'
import React from 'react'

const page = async () => {
  await requireDoctorAuth()
  return (
    <div>
    <VideoCalls/>      
    </div>
  )
}

export default page