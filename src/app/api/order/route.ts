// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, items, address, phoneNumber, } = body;

    if (!userId || !items || !address || !phoneNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find user by Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Find patient associated with the user
    const patient = await prisma.patient.findUnique({
      where: { userId: user.id },
    });

    if (!patient) {
      return NextResponse.json(
        { error: "Patient record not found" },
        { status: 404 }
      );
    }


    // Update inventory (decrease quantity)
    for (const item of items) {
      const inventoryItem = await prisma.inventoryItem.findFirst({
        where: {
          medicineId: item.medicine.id,
          quantity: { gte: item.quantity }
        },
        orderBy: {
          expiryDate: 'asc'
        }
      });

      if (inventoryItem) {
        await prisma.inventoryItem.update({
          where: { id: inventoryItem.id },
          data: {
            quantity: inventoryItem.quantity - item.quantity
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Order placed successfully"
    });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}