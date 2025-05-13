/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { users } from "@clerk/clerk-sdk-node";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, username, password } = await req.json();

    console.log("Received Data:", { email, username, password });

    // Basic validations
    if (!email || !username || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    // Check if email already exists in Clerk
    const existingClerkUsers = await users.getUserList({ emailAddress: [email] });
    if (existingClerkUsers.length > 0) {
      return NextResponse.json({ error: "Email already registered in Clerk" }, { status: 400 });
    }

    // Check if email already exists in Prisma
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered in Prisma" }, { status: 400 });
    }

    // Clean username and make unique
    const slugifiedUsername = username.trim().replace(/\s+/g, "_").toLowerCase();
    const uniqueUsername = `${slugifiedUsername}_${Date.now()}`;

    // Create Clerk user
    const clerkUser = await users.createUser({
      username: uniqueUsername,
      emailAddress: [email],
      password,
    });

    console.log("Clerk User Created:", clerkUser);

    if (!clerkUser.id) {
      return NextResponse.json({ error: "Failed to register user in Clerk" }, { status: 400 });
    }

    // Save user in Prisma
    await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email,
        role: "PATIENT",
        firstName: username,
        patient: {
          create: {
            name: username,
            age: 0,
            gender: "Unknown",
            phoneNumber: "0000000000",
            address: "Unknown",
            // medicalHistory: "None",
          },
        },
      },
    });

    return NextResponse.json({ message: "Patient registered successfully", clerkUser }, { status: 201 });

  } catch (error: unknown) {
    console.error("Registration error:", error);

    if ((error as any)?.errors) {
      console.error("Clerk validation errors:", (error as any).errors);
    }

    if (error instanceof Error) {
      console.error(error.message);
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
