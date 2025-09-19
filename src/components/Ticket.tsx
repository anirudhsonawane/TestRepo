"use client";

import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  IdCard,
  MapPin,
  Ticket as TicketIcon,
  User,
} from "lucide-react";
import QRCode from "react-qr-code";
import Spinner from "./Spinner";
import { useStorageUrl } from "@/lib/utils";
import Image from "next/image";

export default function Ticket({ ticketId }: { ticketId: Id<"tickets"> }) {
  const ticket = useQuery(api.tickets.getById, { ticketId });
  const ticketStatus = useQuery(api.tickets.getTicketStatus, { ticketId });
  const event = useQuery(api.events.getById, 
    ticket?.eventId ? { eventId: ticket.eventId } : "skip"
  );
  const user = useQuery(api.users.getUserById, {
    userId: ticket?.userId ?? "",
  });
  const selectedPass = useQuery(api.passes.getPassById, 
    ticket?.passId ? { passId: ticket.passId } : "skip"
  );
  const imageUrl = useStorageUrl(event?.imageStorageId);

  // Force component re-render every 2 seconds for real-time updates
  const [, forceUpdate] = useState({});
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate({});
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getUserTheme = (ticketId: string) => {
    const themes = [
      { bg: "bg-gradient-to-br from-gray-50 to-white", accent: "text-blue-600", light: "bg-gray-50", border: "border-gray-200" }, // Aligned with site light theme
      { bg: "bg-gradient-to-br from-blue-50 to-white", accent: "text-blue-600", light: "bg-blue-50", border: "border-blue-200" },
      { bg: "bg-gradient-to-br from-indigo-50 to-white", accent: "text-indigo-600", light: "bg-indigo-50", border: "border-indigo-200" },
      // Add more themes matching site palette
    ];
    const hash = ticketId.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0);
    return themes[Math.abs(hash) % themes.length];
  };

  if (!ticket || !event || !user || !ticketStatus) {
    return <Spinner />;
  }

  const theme = getUserTheme(ticket._id);
  const { scannedCount, totalCount, isScanned, scannedAt } = ticketStatus;

  return (
    <div
      className={`bg-white rounded-xl overflow-hidden shadow-sm border ${event.is_cancelled ? "border-red-200" : theme.border}`} // Softened shadow for site consistency
    >
      {/* Event Header with Image */}
      <div className="relative">
        {imageUrl && (
          <div className="relative w-full aspect-[21/9]">
            <Image
              src={imageUrl}
              alt={event.name}
              fill
              className={`object-cover object-center ${event.is_cancelled ? "opacity-50" : ""}`}
              priority
            />
            <div className={`absolute inset-0 ${theme.bg} opacity-75`} /> // Subtle overlay matching site gradients
          </div>
        )}
        <div
          className={`px-4 sm:px-6 py-3 sm:py-4 ${imageUrl ? "absolute bottom-0 left-0 right-0" : event.is_cancelled ? "bg-red-50" : theme.bg} ${imageUrl ? theme.bg + ' opacity-90' : ''}`} // Used site-like bg-red-50
        >
          <h2
            className={`text-xl sm:text-2xl font-bold ${imageUrl || !imageUrl ? "text-gray-900" : "text-gray-900"}`} // Consistent text color
          >
            {event.name}
          </h2>
          {event.is_cancelled && (
            <p className="text-red-600 mt-1">This event has been cancelled</p> // Matched site red tones
          )}
        </div>
      </div>

      {/* Ticket Content */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Left Column - Event Details */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start gap-4 text-gray-600">
              <CalendarDays className={`w-5 h-5 mt-1 ${event.is_cancelled ? "text-red-600" : theme.accent}`} />
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="text-base">{new Date(event.eventDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <MapPin
                className={`w-4 sm:w-5 h-4 sm:h-5 mr-3 ${event.is_cancelled ? "text-red-600" : theme.accent}`}
              />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{event.location}</p>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <User
                className={`w-4 sm:w-5 h-4 sm:h-5 mr-3 ${event.is_cancelled ? "text-red-600" : theme.accent}`}
              />
              <div>
                <p className="text-sm text-gray-500">Ticket Holder</p>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center text-gray-600 break-all">
              <IdCard
                className={`w-4 sm:w-5 h-4 sm:h-5 mr-3 ${event.is_cancelled ? "text-red-600" : theme.accent}`}
              />
              <div>
                <p className="text-sm text-gray-500">Ticket Holder ID</p>
                <p className="font-medium">{user.userId}</p>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <TicketIcon
                className={`w-4 sm:w-5 h-4 sm:h-5 mr-3 ${event.is_cancelled ? "text-red-600" : theme.accent}`}
              />
              <div>
                <p className="text-sm text-gray-500">{selectedPass ? 'Pass Type' : 'Ticket Price'}</p>
                <p className="font-medium">{selectedPass?.name || 'General Admission'}</p>
                <p className="text-sm text-gray-500">₹{selectedPass?.price?.toFixed(2) || event.price.toFixed(2)}</p>
                <p className="text-xs text-gray-400">Pass ID: {ticket.passId || 'None'}</p>
              </div>
            </div>
          </div>

          {/* Right Column - QR Code */}
          <div className="flex flex-col items-center justify-center lg:border-l border-t lg:border-t-0 border-gray-200 pt-6 lg:pt-0 lg:pl-6">
            <div
              className={`bg-gray-50 p-4 rounded-lg ${event.is_cancelled ? "opacity-50" : ""}`} // Matched site bg-gray-50
            >
              <QRCode value={ticket._id} className="w-24 h-24 sm:w-32 sm:h-32" />
            </div>
            <p className="mt-2 text-xs sm:text-sm text-gray-500 break-all text-center max-w-[200px] md:max-w-full">
              Ticket ID: {ticket._id}
            </p>
          </div>
        </div>

        {/* Pass Benefits with updated styling */}
        {selectedPass && selectedPass.benefits && selectedPass.benefits.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Pass Benefits
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedPass.benefits.map((benefit, index) => (
                <li key={index} className={`flex items-center gap-3 p-3 rounded-lg bg-gray-50`}> // Simplified to site bg-gray-50
                  <span className={`w-2 h-2 rounded-full ${theme.accent.replace('text', 'bg')}`}></span>
                  <span className="text-sm text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Ticket Footer with modern styling */}
        <div className={`mt-8 -mx-8 -mb-8 px-8 py-6 ${event.is_cancelled ? "bg-red-50" : "bg-gray-50"} border-t border-gray-200`}> // Matched site backgrounds
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${event.is_cancelled ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}> // Consistent status badges
                {event.is_cancelled ? "Cancelled" : isScanned ? "Scanned" : "Valid Ticket"}
              </span>
              <span className="text-sm text-gray-500">
                {scannedCount}/{totalCount} scanned
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Purchased: {new Date(ticket.purchasedAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
