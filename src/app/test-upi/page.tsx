"use client";

import { useState } from "react";
import UPIPaymentSimple from "@/components/UPIPaymentSimple";
import { Id } from "../../convex/_generated/dataModel";

export default function TestUPIPage() {
  const [amount, setAmount] = useState(750);
  const [quantity, setQuantity] = useState(1);
  const [eventName, setEventName] = useState("Test Event");

  // Mock event ID for testing
  const mockEventId = "mock_event_id" as Id<"events">;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            UPI Payment System Test
          </h1>
          
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Name
              </label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter event name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="10"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <UPIPaymentSimple
              eventId={mockEventId}
              eventName={eventName}
              amount={amount}
              quantity={quantity}
              onPaymentInitiated={() => {
                console.log("Payment initiated!");
              }}
            />
          </div>

          <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-2">Setup Instructions:</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Add your UPI ID to environment variables: <code>NEXT_PUBLIC_UPI_ID=your-upi@bank</code></li>
              <li>Add your business name: <code>NEXT_PUBLIC_PAYEE_NAME=Your Business Name</code></li>
              <li>Test the UPI deep link generation</li>
              <li>Test the QR code generation</li>
              <li>Verify the payment flow works</li>
            </ol>
          </div>

          <div className="mt-6 bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="font-medium text-green-900 mb-2">How it works:</h3>
            <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
              <li>Customer clicks "Pay with UPI" → UPI deep link opens</li>
              <li>Payment details are pre-filled in their UPI app</li>
              <li>Customer completes payment and takes screenshot</li>
              <li>Customer contacts organizer with payment proof</li>
              <li>Organizer verifies payment and creates ticket manually</li>
            </ul>
          </div>

          <div className="mt-6 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h3 className="font-medium text-yellow-900 mb-2">Example UPI Deep Link:</h3>
            <code className="text-xs text-yellow-800 break-all">
              upi://pay?pa=your-upi@bank&pn=Your%20Business&am={amount}&cu=INR&tn={encodeURIComponent(`${quantity} ticket${quantity > 1 ? 's' : ''} for ${eventName}`)}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
