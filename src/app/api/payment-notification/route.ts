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
    
    // Store payment notification in Convex database
    const notificationId = await convex.mutation(api.paymentNotifications.create, {
      eventId,
      userId,
      amount,
      quantity,
      passId: passId || undefined,
      upiTransactionId: upiTransactionId || undefined,
      paymentMethod: paymentMethod || undefined,
      notes: notes || undefined,
      contactMethod: contactMethod || 'whatsapp',
      contactInfo: contactInfo || undefined,
      userInfo: userInfo || undefined,
    });
    
    console.log("Payment notification created with ID:", notificationId);
    
    return NextResponse.json({ 
      success: true, 
      notificationId: notificationId,
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
