"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { 
  Plus, 
  X, 
  Shield, 
  Ticket, 
  DollarSign, 
  MessageCircle, 
  HelpCircle,
  User,
  Calendar,
  Bell,
  CreditCard,
  Phone,
  Mail,
  ExternalLink
} from "lucide-react";
import { isAuthorizedAdmin } from "@/lib/admin-config";

export default function SmartFloatingButton() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  
  const isAdmin = user && isAuthorizedAdmin(user.emailAddresses[0]?.emailAddress || '');

  // Don't show on certain pages
  const hiddenPages = ['/admin', '/seller'];
  const shouldHide = hiddenPages.some(page => pathname.startsWith(page));

  // Show notification after a delay (simulating new payment notification)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 10000); // Show after 10 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded || !user || shouldHide) {
    return null;
  }

  // Get page-specific menu items
  const getPageSpecificItems = () => {
    const baseItems = [
      {
        icon: Ticket,
        label: "My Tickets",
        action: () => router.push('/tickets'),
        color: "bg-blue-600 hover:bg-blue-700",
        show: true,
      },
      {
        icon: Calendar,
        label: "Create Event",
        action: () => router.push('/seller/new-event'),
        color: "bg-green-600 hover:bg-green-700",
        show: true,
      },
      {
        icon: Shield,
        label: "Admin Panel",
        action: () => router.push('/admin/payments'),
        color: "bg-purple-600 hover:bg-purple-700",
        show: isAdmin,
      },
    ];

    // Add page-specific items
    if (pathname === '/') {
      baseItems.push({
        icon: DollarSign,
        label: "How to Pay",
        action: () => {
          alert("UPI Payment Steps:\n\n1. Click 'Pay with UPI'\n2. Select your UPI app\n3. Enter UPI PIN\n4. Take screenshot\n5. Notify organizer");
        },
        color: "bg-yellow-600 hover:bg-yellow-700",
        show: true,
      });
    }

    if (pathname.startsWith('/event/')) {
      baseItems.push({
        icon: CreditCard,
        label: "Payment Help",
        action: () => {
          alert("Need help with payment?\n\n1. Use any UPI app (GPay, PhonePe, Paytm)\n2. Take screenshot after payment\n3. Contact organizer with proof\n4. Get your ticket!");
        },
        color: "bg-indigo-600 hover:bg-indigo-700",
        show: true,
      });
    }

    // Add contact options
    baseItems.push(
      {
        icon: Phone,
        label: "Call Support",
        action: () => {
          window.open('tel:+919876543210', '_self');
        },
        color: "bg-green-500 hover:bg-green-600",
        show: true,
      },
      {
        icon: MessageCircle,
        label: "WhatsApp",
        action: () => {
          const message = "Hi! I need help with my ticket purchase.";
          const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, '_blank');
        },
        color: "bg-green-600 hover:bg-green-700",
        show: true,
      },
      {
        icon: Mail,
        label: "Email Support",
        action: () => {
          window.open('mailto:support@t-system.com?subject=Ticket Support', '_self');
        },
        color: "bg-gray-600 hover:bg-gray-700",
        show: true,
      }
    );

    return baseItems.filter(item => item.show);
  };

  const menuItems = getPageSpecificItems();

  return (
    <>
      {/* Notification Badge */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
          <Bell className="w-4 h-4" />
          <span className="text-sm">New payment notification!</span>
          <button
            onClick={() => setShowNotification(false)}
            className="ml-2 text-white hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-50">
        {/* Menu Items */}
        <div className={`absolute bottom-16 right-0 mb-2 space-y-2 transition-all duration-300 ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`flex items-center space-x-3 ${item.color} text-white px-4 py-3 rounded-full shadow-lg cursor-pointer transform transition-all duration-200 hover:scale-105`}
                onClick={() => {
                  item.action();
                  setIsOpen(false);
                }}
                style={{
                  animationDelay: isOpen ? `${index * 0.1}s` : '0s',
                }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium whitespace-nowrap">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Main FAB Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
            isOpen 
              ? 'bg-red-600 hover:bg-red-700 rotate-45' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          aria-label="Quick Actions"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Plus className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-20 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </>
  );
}
