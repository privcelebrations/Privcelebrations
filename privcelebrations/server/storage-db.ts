import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { theatres, packages, bookings, contacts } from "@shared/schema";
import type { Theatre, Package, Booking, Contact, InsertTheatre, InsertPackage, InsertBooking, InsertContact } from "@shared/schema";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // Theatres
  async getTheatres(): Promise<Theatre[]> {
    return await db.select().from(theatres);
  }

  async getTheatre(id: string): Promise<Theatre | undefined> {
    const [theatre] = await db.select().from(theatres).where(eq(theatres.id, id));
    return theatre || undefined;
  }

  // Packages
  async getPackages(): Promise<Package[]> {
    return await db.select().from(packages);
  }

  async getPackage(id: string): Promise<Package | undefined> {
    const [pkg] = await db.select().from(packages).where(eq(packages.id, id));
    return pkg || undefined;
  }

  // Bookings
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [created] = await db.insert(bookings).values({
      ...booking,
      email: booking.email || null,
      specialRequests: booking.specialRequests || null,
      packageIds: booking.packageIds || null,
    }).returning();
    return created;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  async getBookings(): Promise<Booking[]> {
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking | undefined> {
    const [updated] = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, id))
      .returning();
    return updated || undefined;
  }

  // Contacts
  async createContact(contact: InsertContact): Promise<Contact> {
    const [created] = await db.insert(contacts).values(contact).returning();
    return created;
  }

  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }
}