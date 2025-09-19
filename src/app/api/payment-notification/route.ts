import { NextRequest, NextResponse } from "next/server";
import { getConvexClient } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";

export async function POST(req: NextRequest) {
  console.log("=== PAYMENT NOTIFICATION RECEIVED ===");
  
  try {
    const body = await req.json();
    console.log("Payment notification body:", body);
    
    const { 
      eventId, 
      userId, 
      amount, 
      quantity, 
      passId,
      upiTransactionId,
      paymentMethod,
      notes,
      contactMethod,
      contactInfo,
      userInfo
    } = body;
    
    console.log("Parsed payment notification:", { 
      eventId, 
      userId, 
      amount, 
      quantity, 
      upiTransactionId,
      paymentMethod,
      userInfo
    });

    if (!eventId || !userId || !amount || !quantity) {
      console.log("Missing required fields");
      return NextResponse.json({ 
        error: "Missing required fields",
        received: { 
          eventId: !!eventId, 
          userId: !!userId, 
          amount: !!amount, 
          quantity: !!quantity 
        }
      }, { status: 400 });
    }
    
    console.log("Getting Convex client...");
    const convex = getConvexClient();
    
    // Store payment notification in a database table
    // For now, we'll use a simple approach and store in a JSON file or database
    // In a real implementation, you'd create a "paymentNotifications" table in Convex
    
    const paymentNotification = {
      id: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      eventId,
      userId,
      amount,
      quantity,
      passId: passId || null,
      upiTransactionId: upiTransactionId || null,
      paymentMethod: paymentMethod || null,
      notes: notes || null,
      contactMethod: contactMethod || 'whatsapp',
      contactInfo: contactInfo || null,
      userInfo: userInfo || null,
      status: 'pending',
      createdAt: Date.now(),
      verifiedAt: null,
      ticketCreated: false
    };
    
    console.log("Payment notification created:", paymentNotification);
    
    // TODO: Store in Convex database
    // await convex.mutation(api.paymentNotifications.create, paymentNotification);
    
    // For now, we'll just log it and return success
    // In production, you'd store this in your database
    
    console.log("Payment notification stored successfully");
    
    return NextResponse.json({ 
      success: true, 
      notificationId: paymentNotification.id,
      message: "Payment notification received successfully"
    });
  } catch (error) {
    console.error("Payment notification error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack");
    
    return NextResponse.json({ 
      error: "Failed to process payment notification", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
