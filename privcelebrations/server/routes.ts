import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertContactSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all theatres
  app.get("/api/theatres", async (req, res) => {
    try {
      const theatres = await storage.getTheatres();
      res.json(theatres);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch theatres" });
    }
  });

  // Get theatre by ID
  app.get("/api/theatres/:id", async (req, res) => {
    try {
      const theatre = await storage.getTheatre(req.params.id);
      if (!theatre) {
        return res.status(404).json({ message: "Theatre not found" });
      }
      res.json(theatre);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch theatre" });
    }
  });

  // Get all packages
  app.get("/api/packages", async (req, res) => {
    try {
      const packages = await storage.getPackages();
      res.json(packages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });

  // Create booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      
      // Calculate total price
      const theatre = await storage.getTheatre(validatedData.theatreId);
      if (!theatre) {
        return res.status(404).json({ message: "Theatre not found" });
      }
      
      let totalPrice = parseFloat(theatre.basePrice);
      
      // Add package prices if any
      if (validatedData.packageIds && validatedData.packageIds.length > 0) {
        for (const packageId of validatedData.packageIds) {
          const pkg = await storage.getPackage(packageId);
          if (pkg) {
            totalPrice += parseFloat(pkg.price);
          }
        }
      }
      
      const booking = await storage.createBooking({
        ...validatedData,
        totalPrice: totalPrice.toString()
      });
      
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Get all bookings (admin endpoint)
  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Get booking by ID
  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch booking" });
    }
  });

  // Update booking status (admin endpoint)
  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const booking = await storage.updateBookingStatus(req.params.id, status);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });

  // Get all contacts (admin endpoint)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  // Create contact
  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create contact" });
    }
  });

  // WhatsApp integration endpoint
  app.post("/api/whatsapp", async (req, res) => {
    try {
      const { message, phone } = req.body;
      const whatsappNumber = process.env.WHATSAPP_BUSINESS_NUMBER || "+15551234567";
      
      // In a real implementation, you would integrate with WhatsApp Business API
      // For now, we'll return the WhatsApp URL for redirection
      const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
      
      res.json({ whatsappUrl });
    } catch (error) {
      res.status(500).json({ message: "Failed to process WhatsApp request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
