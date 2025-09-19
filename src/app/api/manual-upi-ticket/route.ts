import { NextRequest, NextResponse } from "next/server";
import { getConvexClient } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";

export async function POST(req: NextRequest) {
  console.log("=== MANUAL UPI TICKET CREATION ===");
  
  try {
    const body = await req.json();
    console.log("Request body:", body);
    
    const { 
      eventId, 
      userId, 
      paymentReference, 
      quantity = 1, 
      amount = 100, 
      passId,
      upiTransactionId,
      paymentScreenshot,
      notes
    } = body;
    
    console.log("Parsed data:", { 
      eventId, 
      userId, 
      paymentReference, 
      quantity, 
      amount, 
      passId,
      upiTransactionId 
    });

    if (!eventId || !userId || !paymentReference) {
      console.log("Missing fields - eventId:", !!eventId, "userId:", !!userId, "paymentReference:", !!paymentReference);
      return NextResponse.json({ 
        error: "Missing required fields",
        received: { 
          eventId: !!eventId, 
          userId: !!userId, 
          paymentReference: !!paymentReference 
        }
      }, { status: 400 });
    }
    
    console.log("Getting Convex client...");
    const convex = getConvexClient();
    
    // Use the payment reference as the payment intent ID
    // Format: upi-{timestamp}-{random} or upi-{upiTransactionId}
    const paymentIntentId = upiTransactionId ? `upi-${upiTransactionId}` : `upi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.log("Calling issueAfterPayment mutation...");
    const result = await convex.mutation(api.tickets.issueAfterPayment, {
      eventId,
      userId,
      paymentIntentId,
      amount,
      quantity,
      passId: passId || undefined,
    });
    
    console.log("Ticket created successfully:", result);
    
    // Mark purchase as complete
    console.log("Marking purchase complete...");
    await convex.mutation(api.purchaseComplete.markPurchaseComplete, {
      eventId,
      userId,
    });
    
    console.log("Purchase marked complete");
    
    // TODO: Store additional UPI payment details in a separate table for admin reference
    // This could include payment screenshot, notes, etc.
    
    return NextResponse.json({ 
      success: true, 
      ticketId: result,
      paymentIntentId,
      message: "Ticket created successfully"
    });
  } catch (error) {
    console.error("Manual UPI ticket creation error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack");
    
    return NextResponse.json({ 
      error: "Failed to create ticket", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
