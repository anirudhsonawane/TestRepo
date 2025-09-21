import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';

const getConvexClient = () => {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
  }
  return new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      eventId, 
      userId, 
      amount, 
      quantity, 
      passId, 
      upiTransactionId, 
      payeeName, 
      payeeMobileNumber,
      userInfo 
    } = body;

    // Validate required fields
    if (!eventId || !userId || !amount || !upiTransactionId || !payeeName || !payeeMobileNumber) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create payment notification in Convex
    const convex = getConvexClient();
    const notificationId = await convex.mutation(api.paymentNotifications.create, {
      eventId,
      userId,
      amount,
      quantity: quantity || 1,
      passId,
      upiTransactionId,
      payeeName,
      payeeMobileNumber,
      userInfo: userInfo || {},
      status: 'pending'
    });

    return NextResponse.json({ 
      success: true, 
      notificationId,
      message: 'Payment notification created successfully' 
    });

  } catch (error) {
    console.error('Payment notification API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
