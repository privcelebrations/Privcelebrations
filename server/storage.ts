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
        description: "Our premium suite featuring Capacity up to 6 - Max Capacity 10 - 2299 ( Includes Decor, extra person 299)",
        capacity: 8,
        basePrice: "2299.00",
        imageUrl: '/images/theatres/overthemoon.jpg',
        amenities: ["Capacity up to 6 - Max Capacity 10", "3-hour experience", "Food and Beverages can be ordered at the theatre."],
        rating: "5.0",
        duration: "3-hour experience"
      },
      {
        name: "Velvet Amour",
        description: "Intimate setting for 2 guests with love seats, Capacity up to 2 - Max Capacity 6 - 1699 (Includes Love Decor, extra person 299)",
        capacity: 4,
        basePrice: "1899.00",
        imageUrl: '/images/theatres/otm.jpg',
        amenities: ["Capacity up to 2 - Max Capacity 6", "3-hour experience", "Perfect for date nights", "Food and Beverages can be ordered at the theatre."],
        rating: "5.0",
        duration: "3-hour experience"
      },
      {
        name: "Golden Imperial",
        description: "Spacious theatre for larger groups with tiered seating, Capacity upto 10 - Max capacity 20 - 3699 ( which includes decor, extra person 299), and party decorations",
        capacity: 20,
        basePrice: "3699.00",
        imageUrl: '/images/theatres/grand.jpg',
        amenities: [" Capacity upto 10 - Max capacity 20", "3-hour experience", "Great for celebrations", "Food and Beverages can be ordered at the theatre."],
        rating: "5.0",
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
    name: 'Fog Effect (Grand entry)',
    description: 'Fog Special Effect (Grand entry)',
    price: '899.00',
    icon: 'fas fa-utensils',
    features: [
      'Fog Effect',
      ],
  },
  {
    name: 'Photo Clippings (16 Pics)',
    description: 'Photo Clippings (16 Pics)',
    price: '449.00',
    icon: 'fas fa-gamepad',
    features: ['Photo Clippings (16 Pics)'],
  },  
  {
    name: 'Party Props',
    description: 'Party Props',
    price: '149.00',
    icon: 'fas fa-gamepad',
    features: ['Party Props'],
  },
  {
    name: 'Karaoke',
    description: 'Karaoke',
    price: '349.00',
    icon: 'fas fa-gamepad',
    features: ['Karaoke'],
  },
  {
    name: 'LED Number',
    description: 'LED Number',
    price: '99.00',
    icon: 'fas fa-gamepad',
    features: ['LED Number'],
  },
  {
    name: 'LED Alphabets',
    description: 'LED Alphabets',
    price: '99.00',
    icon: 'fas fa-gamepad',
    features: ['LED Alphabets'],
  },
  {
    name: 'Sash',
    description: 'Sash',
    price: '149.00',
    icon: 'fas fa-gamepad',
    features: ['Sash'],
  },
  {
    name: 'Rose petals heart',
    description: 'Rose petals heart',
    price: '199.00',
    icon: 'fas fa-gamepad',
    features: ['Rose petals heart'],
  },
  {
    name: 'Rose petals walkway',
    description: 'Rose petals walkway',
    price: '249.00',
    icon: 'fas fa-gamepad',
    features: ['Rose petals walkway'],
  },
  {
    name: 'Cold fire entry',
    description: 'Cold fire entry',
    price: '999.00',
    icon: 'fas fa-gamepad',
    features: ['Cold fire entry'],
  },
  {
    name: 'Photography - 1 hour',
    description: "Photography - 1 hour",
    price: '1199.00',
    icon: 'fas fa-child',
    features: ['Photography for 1 hour'],
  },
 {
    name: 'Minimal Combo 2445/- @ 20% off (INR 1899)',
    description:
      'Minimal Combo 2445/- @ 20% off (Rs. 1899/-) Make their special day unforgettable with personalized decorations and treats',
    price: '1899.00',
    icon: 'fas fa-birthday-cake',
    features: [
      'Party Props',
      'LED Number',
      'LED Alphabets',
      'Fog Effect',
      'Photography',
    ],
  },
  {
    name: 'Kiddo Combo 3893/- @ 20% off (INR 3199)',
    description: ' Kiddo Combo 3893/- @ 20% off (Rs. 3199/-) ',
    price: '3199.00',
    icon: 'fas fa-heart',
    features: [
      'Photo Clippings (16 Pics)',
      'Party Props',
      'LED Number',
      'LED Alphabets',
      'Fog Effect',
      'Photography',
      'Cold fire entry',
    ],
  },
  {
    name: 'Family Combo 4092/- @ 20% off (INR 3299)',
    description:
      'Family Combo 4092/- @ 20% off (Rs. 3299/-) ',
    price: '3299.00',
    icon: 'fas fa-briefcase',
    features: [
      'Photo Clippings (16 Pics)',
      'Party Props',
      'LED Number',
      'LED Alphabets',
      'Fog Effect',
      'Photography',
      'Cold fire entry',
      'Rose petals heart',
    ],
  },
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
