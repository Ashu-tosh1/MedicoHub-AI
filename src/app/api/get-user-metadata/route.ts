// app/api/get-user-metadata/route.ts
// import { auth, currentUser } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Extract role from metadata
    const role = user.publicMetadata?.role || 
                 user.unsafeMetadata?.role || 
                 null;
    
    return NextResponse.json({ role });
  } catch (error) {
    console.error("Error fetching user metadata:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}