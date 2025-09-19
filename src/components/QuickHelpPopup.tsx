"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { 
  HelpCircle, 
  X, 
  Smartphone, 
  CreditCard, 
  MessageCircle,
  Phone,
  Mail,
  ExternalLink
} from "lucide-react";

export default function QuickHelpPopup() {
  const { user, isLoaded } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  if (!isLoaded || !user) {
    return null;
  }

  const helpItems = [
    {
      icon: Smartphone,
      title: "UPI Payment",
      description: "How to pay with UPI apps",
      action: () => {
        alert("UPI Payment Steps:\n\n1. Click 'Pay with UPI' button\n2. Your UPI app will open automatically\n3. Enter your UPI PIN\n4. Take a screenshot of payment confirmation\n5. Click 'Notify Organizer' and submit payment details\n6. Organizer will verify and create your ticket");
      }
    },
    {
      icon: CreditCard,
      title: "Payment Issues",
      description: "Troubleshooting payment problems",
      action: () => {
        alert("Common Payment Issues:\n\n• UPI app not opening: Copy the UPI link manually\n• Payment failed: Check your UPI balance\n• No confirmation: Take screenshot and contact organizer\n• Wrong amount: Contact organizer immediately\n• Payment not received: Wait 5-10 minutes and try again");
      }
    },
    {
      icon: MessageCircle,
      title: "Contact Support",
      description: "Get help from our team",
      action: () => {
        const message = "Hi! I need help with my ticket purchase.";
        const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      }
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak with support team",
      action: () => {
        window.open('tel:+919876543210', '_self');
      }
    }
  ];

  return (
    <>
      {/* Help Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
          aria-label="Quick Help"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Help Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Invisible backdrop for closing */}
          <div 
            className="absolute inset-0 -z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Quick Help</h2>
                  <p className="text-sm text-gray-600">Get instant support</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {helpItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    onClick={() => {
                      item.action();
                      setIsOpen(false);
                    }}
                    className="flex items-start gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Still need help? Contact us directly
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      const message = "Hi! I need help with my ticket purchase.";
                      const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
                      window.open(whatsappUrl, '_blank');
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => {
                      window.open('mailto:support@t-system.com?subject=Ticket Support', '_self');
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
