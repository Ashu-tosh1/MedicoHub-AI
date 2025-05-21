
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const requireDoctorAuth = async () => {
  const user = await currentUser();
  
  // If no user is logged in, redirect to doctor login page
  if (!user) {
    redirect("/doctor/login");
  }
  
  // Get the user's role from metadata
  const role = user.publicMetadata?.role;
  
  // If user is not a doctor, redirect to unauthorized page
  if (role !== "doctor") {
    redirect("/unauthorized");
  }
  
  return {
    user,
    role,
  };
};