'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "../ui/card";

interface Patient {
  id: string;
  userId: string;
  name: string;
  age: number;
  gender: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  address?: string;
}

interface Props {
  collapsed?: boolean;
}

export default function PatientProfileCard({ collapsed = false }: Props) {
  const { user, isLoaded } = useUser();
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (isLoaded && user) {
        try {
          const clerkId = user.id;
          if (!clerkId) return;

          const res = await fetch(`/api/patient/profile?clerkId=${clerkId}`);
          if (!res.ok) throw new Error("Failed to fetch patient profile");

          const data = await res.json();
          setPatientData(data);
        } catch (error) {
          console.error("Error fetching patient data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPatientData();
  }, [isLoaded, user]);

  if (collapsed) return null;

  if (loading) {
    return (
      <Card className="w-full max-w-sm shadow-sm border rounded-2xl p-4">
        <CardContent className="space-y-3">
          {/* <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" /> */}
                Loading 
        </CardContent>
      </Card>
    );
  }

  if (!patientData) {
    return (
      <Card className="w-full max-w-sm border p-4">
        <CardContent className="text-red-500">Patient data not found.</CardContent>
      </Card>
    );
  }

  const getTitle = () => {
    const gender = patientData.gender?.toLowerCase();
    return gender === "male" ? "Mr." : gender === "female" ? "Mrs." : "";
  };

  return (
    <Card className="w-full max-w-sm border rounded-2xl shadow-md bg-gradient-to-r from-blue-50 to-white">
      <CardContent className="p-5">
        <h2 className="text-xl font-bold text-gray-800">
          {getTitle()} {patientData.name}
        </h2>
        <p className="text-gray-600 text-sm mt-1">Age: {patientData.age}</p>
      </CardContent>
    </Card>
  );
}
