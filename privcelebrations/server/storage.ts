import { type Theatre, type Package, type Booking, type Contact, type InsertTheatre, type InsertPackage, type InsertBooking, type InsertContact } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Theatres
  getTheatres(): Promise<Theatre[]>;
  getTheatre(id: string): Promise<Theatre | undefined>;
  
  // Packages
  getPackages(): Promise<Package[]>;
  getPackage(id: string): Promise<Package | undefined>;
  
  // Bookings
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: string): Promise<Booking | undefined>;
  getBookings(): Promise<Booking[]>;
  updateBookingStatus(id: string, status: string): Promise<Booking | undefined>;
  
  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
}

export class MemStorage implements IStorage {
  private theatres: Map<string, Theatre> = new Map();
  private packages: Map<string, Package> = new Map();
  private bookings: Map<string, Booking> = new Map();
  private contacts: Map<string, Contact> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed theatres
    const theatresData: Omit<Theatre, 'id'>[] = [
      {
        name: "Imperial Suite",
        description: "Our premium suite featuring 8 luxury recliners, personal wait service, and champagne bar",
        capacity: 8,
        basePrice: "2699.00",
        imageUrl: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        amenities: ["Up to 8 guests", "3-hour experience", "Food &amp; Beverages can be ordered at the theatre."],
        rating: "5.0",
        duration: "3-hour experience"
      },
      {
        name: "Royal Chamber",
        description: "Intimate setting for 4 guests with love seats, personal concierge, and gourmet snack service",
        capacity: 4,
        basePrice: "1899.00",
        imageUrl: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        amenities: ["Up to 4 guests", "3-hour experience", "Perfect for date nights", "Food &amp; Beverages can be ordered at the theatre."],
        rating: "5.0",
        duration: "3-hour experience"
      },
      {
        name: "Grand Auditorium",
        description: "Spacious theatre for larger groups with tiered seating, popcorn station, and party decorations",
        capacity: 20,
        basePrice: "3699.00",
        imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        amenities: ["Up to 20 guests", "3-hour experience", "Great for celebrations", "Food &amp; Beverages can be ordered at the theatre."],
        rating: "4.0",
        duration: "3-hour experience"
      }
    ];

    theatresData.forEach(theatre => {
      const id = randomUUID();
      this.theatres.set(id, { ...theatre, id });
    });

    // Seed packages
    const packagesData: Omit<Package, 'id'>[] = [
      {
        name: "Birthday Celebration",
        description: "Perfect for milestone birthdays with custom decorations, birthday cake, and party favors",
        price: "199.00",
        icon: "fas fa-birthday-cake",
        features: ["Custom birthday decorations", "Premium birthday cake", "Party favor bags", "Birthday photo session"]
      },
      {
        name: "Romantic Evening",
        description: "Create unforgettable romantic moments with champagne, roses, and intimate lighting",
        price: "299.00",
        icon: "fas fa-ring",
        features: ["Rose petal decorations", "Premium champagne service", "Romantic lighting setup", "Couples photo memories"]
      },
      {
        name: "Corporate Event",
        description: "Professional networking events with premium catering and presentation capabilities",
        price: "399.00",
        icon: "fas fa-briefcase",
        features: ["Professional setup & branding", "Executive catering menu", "Presentation equipment", "Networking refreshments"]
      }
    ];

    packagesData.forEach(pkg => {
      const id = randomUUID();
      this.packages.set(id, { ...pkg, id });
    });
  }

  async getTheatres(): Promise<Theatre[]> {
    return Array.from(this.theatres.values());
  }

  async getTheatre(id: string): Promise<Theatre | undefined> {
    return this.theatres.get(id);
  }

  async getPackages(): Promise<Package[]> {
    return Array.from(this.packages.values());
  }

  async getPackage(id: string): Promise<Package | undefined> {
    return this.packages.get(id);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = {
      ...insertBooking,
      id,
      email: insertBooking.email || null,
      specialRequests: insertBooking.specialRequests || null,
      packageIds: insertBooking.packageIds || null,
      createdAt: new Date()
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (booking) {
      booking.status = status;
      this.bookings.set(id, booking);
      return booking;
    }
    return undefined;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = {
      ...insertContact,
      id,
      createdAt: new Date()
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }
}

// Use database storage in production, memory storage in development
import { DatabaseStorage } from "./storage-db";

export const storage = process.env.DATABASE_URL 
  ? new DatabaseStorage() 
  : new MemStorage();
