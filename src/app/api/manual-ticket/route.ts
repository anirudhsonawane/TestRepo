import { NextRequest, NextResponse } from "next/server";
import { getConvexClient } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";
import { razorpay } from "@/lib/razorpay";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  console.log("=== MANUAL TICKET CREATION ===");
  
  try {
    const body = await req.json();
    console.log("Request body:", body);
    
    const { eventId, userId, paymentId, quantity = 1, amount = 100, passId, razorpay_order_id, razorpay_signature } = body;
    
    console.log("Parsed data:", { eventId, userId, paymentId, quantity, amount });

    // Verify payment signature if provided
    if (razorpay_order_id && razorpay_signature) {
      const body = razorpay_order_id + "|" + paymentId;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        console.error("Invalid payment signature");
        return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
      }

      // Verify payment status with Razorpay
      try {
        const payment = await razorpay.payments.fetch(paymentId);
        if (payment.status !== "captured") {
          console.error("Payment not captured", payment);
          return NextResponse.json({ error: "Payment not captured" }, { status: 400 });
        }
      } catch (error) {
        console.error("Failed to fetch payment:", error);
        return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
      }
    }
    
    if (!eventId || !userId || !paymentId) {
      console.log("Missing fields - eventId:", !!eventId, "userId:", !!userId, "paymentId:", !!paymentId);
      return NextResponse.json({ 
        error: "Missing required fields",
        received: { eventId: !!eventId, userId: !!userId, paymentId: !!paymentId }
      }, { status: 400 });
    }
    
    console.log("Getting Convex client...");
    const convex = getConvexClient();
    
    console.log("Calling issueAfterPayment mutation...");
    const result = await convex.mutation(api.tickets.issueAfterPayment, {
      eventId,
      userId,
      paymentIntentId: paymentId,
      amount,
      quantity,
      passId: body.passId || undefined,
    });
    
    console.log("Ticket created successfully:", result);
    
    // Ensure user is removed from queue
    console.log("Marking purchase complete...");
    await convex.mutation(api.purchaseComplete.markPurchaseComplete, {
      eventId,
      userId,
    });
    
    console.log("Purchase marked complete");
    
    return NextResponse.json({ 
      success: true, 
      ticketId: result,
      message: "Ticket created successfully"
    });
  } catch (error) {
    console.error("Manual ticket creation error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack");
    
    return NextResponse.json({ 
      error: "Failed to create ticket", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}