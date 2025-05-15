/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaVenusMars, FaHeartbeat, FaTint } from "react-icons/fa";
import Image from "next/image";
import PatientSidebar from "../PatientSidebar";

const PatientProfile: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (isLoaded && user) {
        try {
          const clerkId = user.id; // Use the Clerk user ID to fetch patient data

          if (!clerkId) {
            console.error("No Clerk user ID found.");
            return;
          }

          // Fetch patient profile data based on clerkId
          const res = await fetch(`/api/patient/profile?clerkId=${clerkId}`, {
            method: "GET",
          });

          if (!res.ok) {
            throw new Error("Failed to fetch patient profile");
          }

          const data = await res.json();
          setPatientData(data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching patient data:", error);
          setLoading(false);
        }
      }
    };

    fetchPatientData();
  }, [isLoaded, user]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!patientData) {
    return <div className="flex justify-center items-center min-h-screen">Patient data not found.</div>;
  }

  return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-300 to-blue-100 text-white p-10">
          <aside className="w-1/6 p-6  dark:bg-gray-800 ">
         
         <PatientSidebar/>
      
     </aside>
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden flex">
        {/* Left Section - Profile Details */}
        <div className="w-1/3 bg-gradient-to-br from-blue-900 to-blue-300 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg">
            <Image src="/Doctor.png" width={128} height={128} alt="Profile" className="object-cover" />
          </div>
          <h2 className="text-2xl font-bold mt-4">{patientData.name}</h2>
          <p className="text-lg">{patientData.age} years | {patientData.gender}</p>
          <button className="mt-6 bg-white text-blue-700 font-semibold px-6 py-2 rounded-full hover:bg-blue-100 transition">
            Edit Profile
          </button>
        </div>


       {/* Right Section - Info */}
          <div className="w-2/3 p-10 flex flex-col justify-center">
            <h3 className="text-2xl font-semibold text-blue-900 mb-4">Patient Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center bg-gray-100 text-gray-800 p-3 rounded-lg">
                <FaEnvelope className="text-blue-600 mr-3" /> {patientData.email || "N/A"}
              </div>
              <div className="flex items-center bg-gray-100 text-gray-800 p-3 rounded-lg">
                <FaPhone className="text-blue-600 mr-3" /> {patientData.phoneNumber || "N/A"}
              </div>
              <div className="flex items-center bg-gray-100 text-gray-800 p-3 rounded-lg">
                <FaMapMarkerAlt className="text-blue-600 mr-3" /> {patientData.address || "N/A"}
              </div>
              <div className="flex items-center bg-gray-100 text-gray-800 p-3 rounded-lg">
                <FaVenusMars className="text-blue-600 mr-3" /> {patientData.gender}
              </div>
              <div className="flex items-center bg-gray-100 text-gray-800 p-3 rounded-lg">
                <FaHeartbeat className="text-blue-600 mr-3" /> Date of Birth:{" "}
                {patientData.dateOfBirth ? new Date(patientData.dateOfBirth).toLocaleDateString() : "N/A"}
              </div>
              <div className="flex items-center bg-gray-100 text-gray-800 p-3 rounded-lg">
                <FaTint className="text-blue-600 mr-3" /> Medical History: {patientData.medicalHistory || "N/A"}
              </div>
            </div>
          </div>

      </div>
    </div>
  );
};

export default PatientProfile;
