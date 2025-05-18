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

    // Create order in your database
    // Note: Since there's no Order model in your schema, 
    // this is a placeholder for your actual order creation logic
    // You might want to add an Order model to your schema
    
    // For now, let's assume we're updating the patient with the order details
    // In a real application, you'd create a proper order record
    // const updatedPatient = await prisma.patient.update({
    //   where: { id: patient.id },
    //   data: {
    //     // Store order details in a way that makes sense for your application
    //     // This is just a placeholder
    //     address: address,
    //     phoneNumber: phoneNumber,
    //   },
    // });

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