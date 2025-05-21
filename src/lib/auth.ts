  import { currentUser } from "@clerk/nextjs/server";
  import { redirect } from "next/navigation";

  export const requireAuth = async () => {
    const user = await currentUser();
    
    // If no user is logged in, redirect to login page
    if (!user) {
      redirect("/login");
    }
    
    // Get the user's role from metadata
    const role = user.publicMetadata?.role;
    
    // If user is not a patient, redirect to unauthorized page
    if (role !== "patient") {
      redirect("/unauthorized");
    }
    
    return {
      user,
      role,
    };
  };
