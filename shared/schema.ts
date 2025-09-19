import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const theatres = pgTable("theatres", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  capacity: integer("capacity").notNull(),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url").notNull(),
  additionalImages: text("additional_images").array().notNull().default(sql`'{}'::text[]`),
  amenities: text("amenities").array().notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).notNull(),
  duration: text("duration").notNull(),
});

export const packages = pgTable("packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  icon: text("icon").notNull(),
  features: text("features").array().notNull(),
});

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  theatreId: varchar("theatre_id").notNull(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  partySize: integer("party_size").notNull(),
  bookingDate: text("booking_date").notNull(),
  bookingTime: text("booking_time").notNull(),
  specialRequests: text("special_requests"),
  packageIds: text("package_ids").array().default([]),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const addons = pgTable("addons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // INR
});


// -------------------- Zod Schemas --------------------

export const insertTheatreSchema = createInsertSchema(theatres).omit({
  id: true,
  }).extend({
  additionalImages: z.array(z.string()).optional().default([]), 
});

export const insertPackageSchema = createInsertSchema(packages).omit({
  id: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
}).extend({
  bookingDate: z.string().min(1, "Date is required"),
  bookingTime: z.string().min(1, "Time is required"),
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email().optional().or(z.literal("")),
  partySize: z.number().min(1, "Party size must be at least 1"),
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
}).extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});


export const insertAddonSchema = createInsertSchema(addons).omit({

  id: true,

});

export type Theatre = typeof theatres.$inferSelect;
export type Package = typeof packages.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Contact = typeof contacts.$inferSelect;
export type Addon = typeof addons.$inferSelect;
export type InsertTheatre = z.infer<typeof insertTheatreSchema>;
export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type InsertAddon = z.infer<typeof insertAddonSchema>;
