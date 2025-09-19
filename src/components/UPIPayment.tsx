"use client";

import { useState } from "react";
import { createRazorpayOrder } from "../../actions/createRazorpayOrder";
import { Id } from "../../convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";

declare global {
  interface Window {
    Razorpay: new (options: object) => { open: () => void };
  }
}

interface UPIPaymentProps {
  eventId: Id<"events">;
  eventName: string;
  amount: number;
}

export default function UPIPayment({ eventId, eventName, amount }: UPIPaymentProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const handleUPIPayment = async () => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    setLoading(true);
    try {
      const order = await createRazorpayOrder({ eventId });
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "T-System",
        description: `Ticket for ${eventName}`,
        order_id: order.orderId,
        handler: function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
          // Store payment verification data
          if (!user?.id) {
             console.error("User ID not available");
             return;
           }
           localStorage.setItem('lastEventId', eventId);
           localStorage.setItem('lastUserId', user.id);
           localStorage.setItem('lastQuantity', '1');
           localStorage.setItem('lastAmount', amount.toString());
           localStorage.setItem('lastOrderId', response.razorpay_order_id);
           localStorage.setItem('lastSignature', response.razorpay_signature);
           window.location.href = `/tickets/purchase-success?payment_id=${response.razorpay_payment_id}`;
        },
        prefill: {
           name: user?.fullName || "Customer Name",
           email: user?.emailAddresses?.[0]?.emailAddress || "customer@example.com",
         },
        theme: {
          color: "#3399cc",
        },
        method: {
          upi: true,
          card: false,
          netbanking: false,
          wallet: false,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleUPIPayment}
      disabled={loading}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? "Processing..." : `Pay ₹${amount} via UPI`}
    </button>
  );
}