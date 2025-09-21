import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  events: defineTable({
    name: v.string(),
    description: v.string(),
    location: v.string(),
    eventDate: v.number(),
    endDate: v.optional(v.number()),
    price: v.number(),
    totalTickets: v.number(),
    userId: v.string(),
    is_cancelled: v.optional(v.boolean()),
    imageStorageId: v.optional(v.id("_storage")),
  }),

  passes: defineTable({
    eventId: v.id("events"),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    totalQuantity: v.number(),
    soldQuantity: v.number(),
    benefits: v.array(v.string()),
  }).index("by_event", ["eventId"]),

  tickets: defineTable({
    eventId: v.id("events"),
    userId: v.string(),
    purchasedAt: v.number(),
    status: v.union(v.literal("valid"), v.literal("used"), v.literal("refunded")),
    paymentIntentId: v.string(),
    amount: v.number(),
    scannedAt: v.optional(v.number()),
    passId: v.optional(v.id("passes")),
  })
    .index("by_user", ["userId"])
    .index("by_event", ["eventId"])
    .index("by_user_event", ["userId", "eventId"])
    .index("by_payment_intent", ["paymentIntentId"]),

  waitingList: defineTable({
    eventId: v.id("events"),
    userId: v.string(),
    status: v.union(
      v.literal("waiting"),
      v.literal("offered"),
      v.literal("purchased"),
      v.literal("expired")
    ),
    offerExpiresAt: v.optional(v.number()),
    passId: v.optional(v.id("passes")),
  })
    .index("by_user_event", ["userId", "eventId"])
    .index("by_event_status", ["eventId", "status"]),

  users: defineTable({
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    stripeConnectId: v.optional(v.string()),
  }).index("by_user_id", ["userId"]),

  paymentNotifications: defineTable({
    eventId: v.id("events"),
    userId: v.string(),
    amount: v.number(),
    quantity: v.number(),
    passId: v.optional(v.id("passes")),
    upiTransactionId: v.optional(v.string()),
    paymentMethod: v.optional(v.string()),
    notes: v.optional(v.string()),
    contactMethod: v.optional(v.string()),
    contactInfo: v.optional(v.string()),
    userInfo: v.optional(v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
    })),
    status: v.union(
      v.literal("pending"),
      v.literal("verified"),
      v.literal("rejected")
    ),
    verifiedAt: v.optional(v.number()),
    ticketCreated: v.optional(v.boolean()),
  })
    .index("by_event", ["eventId"])
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_event_status", ["eventId", "status"]),
});