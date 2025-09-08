var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import * as dotenv from "dotenv";
import cors from "cors";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";

// server/db.ts
import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/neon-serverless";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  addons: () => addons,
  bookings: () => bookings,
  contacts: () => contacts,
  insertAddonSchema: () => insertAddonSchema,
  insertBookingSchema: () => insertBookingSchema,
  insertContactSchema: () => insertContactSchema,
  insertPackageSchema: () => insertPackageSchema,
  insertTheatreSchema: () => insertTheatreSchema,
  packages: () => packages,
  theatres: () => theatres
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var theatres = pgTable("theatres", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  capacity: integer("capacity").notNull(),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url").notNull(),
  amenities: text("amenities").array().notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).notNull(),
  duration: text("duration").notNull()
});
var packages = pgTable("packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  icon: text("icon").notNull(),
  features: text("features").array().notNull()
});
var bookings = pgTable("bookings", {
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
  status: text("status").notNull().default("pending"),
  // pending, confirmed, cancelled
  createdAt: timestamp("created_at").defaultNow()
});
var contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var addons = pgTable("addons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull()
  // INR
});
var insertTheatreSchema = createInsertSchema(theatres).omit({
  id: true
});
var insertPackageSchema = createInsertSchema(packages).omit({
  id: true
});
var insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true
}).extend({
  bookingDate: z.string().min(1, "Date is required"),
  bookingTime: z.string().min(1, "Time is required"),
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email().optional().or(z.literal("")),
  partySize: z.number().min(1, "Party size must be at least 1")
});
var insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true
}).extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email is required"),
  message: z.string().min(10, "Message must be at least 10 characters")
});
var insertAddonSchema = createInsertSchema(addons).omit({
  id: true
});

// server/db.ts
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to configure your local PostgreSQL?");
}
var pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
var db = drizzle(pool, { schema: schema_exports });

// server/storage-db.ts
import { eq, desc } from "drizzle-orm";
var DatabaseStorage = class {
  // Theatres
  async getTheatres() {
    return await db.select().from(theatres);
  }
  async getTheatre(id) {
    const [theatre] = await db.select().from(theatres).where(eq(theatres.id, id));
    return theatre || void 0;
  }
  // Packages
  async getPackages() {
    return await db.select().from(packages);
  }
  async getPackage(id) {
    const [pkg] = await db.select().from(packages).where(eq(packages.id, id));
    return pkg || void 0;
  }
  // Bookings
  async createBooking(booking) {
    const [created] = await db.insert(bookings).values({
      ...booking,
      email: booking.email || null,
      specialRequests: booking.specialRequests || null,
      packageIds: booking.packageIds || null
    }).returning();
    return created;
  }
  async getBooking(id) {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || void 0;
  }
  async getBookings() {
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }
  async updateBookingStatus(id, status) {
    const [updated] = await db.update(bookings).set({ status }).where(eq(bookings.id, id)).returning();
    return updated || void 0;
  }
  // Contacts
  async createContact(contact) {
    const [created] = await db.insert(contacts).values(contact).returning();
    return created;
  }
  async getContacts() {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }
};

// server/storage.ts
var MemStorage = class {
  theatres = /* @__PURE__ */ new Map();
  packages = /* @__PURE__ */ new Map();
  bookings = /* @__PURE__ */ new Map();
  contacts = /* @__PURE__ */ new Map();
  constructor() {
    this.seedData();
  }
  seedData() {
    const theatresData = [
      {
        name: "Imperial Suite",
        description: "Our premium suite featuring 8 luxury recliners, personal wait service, and champagne bar",
        capacity: 8,
        basePrice: "2699.00",
        imageUrl: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        amenities: ["Up to 8 guests", "3-hour experience", "Food and Beverages can be ordered at the theatre."],
        rating: "5.0",
        duration: "3-hour experience"
      },
      {
        name: "Royal Chamber",
        description: "Intimate setting for 4 guests with love seats, personal concierge, and gourmet snack service",
        capacity: 4,
        basePrice: "1899.00",
        imageUrl: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        amenities: ["Up to 4 guests", "3-hour experience", "Perfect for date nights", "Food and Beverages can be ordered at the theatre."],
        rating: "5.0",
        duration: "3-hour experience"
      },
      {
        name: "Golden Imperial",
        description: "Spacious theatre for larger groups with tiered seating, popcorn station, and party decorations",
        capacity: 20,
        basePrice: "3699.00",
        imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        amenities: ["Up to 20 guests", "3-hour experience", "Great for celebrations", "Food and Beverages can be ordered at the theatre."],
        rating: "5.0",
        duration: "3-hour experience"
      }
    ];
    theatresData.forEach((theatre) => {
      const id = randomUUID();
      this.theatres.set(id, { ...theatre, id });
    });
    const packagesData = [
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
    packagesData.forEach((pkg) => {
      const id = randomUUID();
      this.packages.set(id, { ...pkg, id });
    });
  }
  async getTheatres() {
    return Array.from(this.theatres.values());
  }
  async getTheatre(id) {
    return this.theatres.get(id);
  }
  async getPackages() {
    return Array.from(this.packages.values());
  }
  async getPackage(id) {
    return this.packages.get(id);
  }
  async createBooking(insertBooking) {
    const id = randomUUID();
    const booking = {
      ...insertBooking,
      id,
      email: insertBooking.email || null,
      specialRequests: insertBooking.specialRequests || null,
      packageIds: insertBooking.packageIds || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.bookings.set(id, booking);
    return booking;
  }
  async getBooking(id) {
    return this.bookings.get(id);
  }
  async getBookings() {
    return Array.from(this.bookings.values());
  }
  async updateBookingStatus(id, status) {
    const booking = this.bookings.get(id);
    if (booking) {
      booking.status = status;
      this.bookings.set(id, booking);
      return booking;
    }
    return void 0;
  }
  async createContact(insertContact) {
    const id = randomUUID();
    const contact = {
      ...insertContact,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.contacts.set(id, contact);
    return contact;
  }
  async getContacts() {
    return Array.from(this.contacts.values());
  }
};
var storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();

// server/routes.ts
import { z as z2 } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/theatres", async (req, res) => {
    try {
      const theatres2 = await storage.getTheatres();
      res.json(theatres2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch theatres" });
    }
  });
  app2.get("/api/theatres/:id", async (req, res) => {
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
  app2.get("/api/packages", async (req, res) => {
    try {
      const packages2 = await storage.getPackages();
      res.json(packages2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });
  app2.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      const theatre = await storage.getTheatre(validatedData.theatreId);
      if (!theatre) {
        return res.status(404).json({ message: "Theatre not found" });
      }
      let totalPrice = parseFloat(theatre.basePrice);
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
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });
  app2.get("/api/bookings", async (req, res) => {
    try {
      const bookings2 = await storage.getBookings();
      res.json(bookings2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });
  app2.get("/api/bookings/:id", async (req, res) => {
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
  app2.patch("/api/bookings/:id/status", async (req, res) => {
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
  app2.get("/api/contacts", async (req, res) => {
    try {
      const contacts2 = await storage.getContacts();
      res.json(contacts2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });
  const handleCreateContact = async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      return res.status(201).json(contact);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        console.warn("Contact validation error:", error.errors);
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      console.error("Failed to create contact:", error);
      return res.status(500).json({ message: "Failed to create contact" });
    }
  };
  app2.post("/api/contacts", handleCreateContact);
  app2.post("/api/contact", handleCreateContact);
  app2.post("/api/whatsapp", async (req, res) => {
    try {
      const { message, phone } = req.body;
      const whatsappNumber = process.env.WHATSAPP_BUSINESS_NUMBER || "+918297642050";
      const whatsappUrl = `https://wa.me/${whatsappNumber.replace("+", "")}?text=${encodeURIComponent(message)}`;
      res.json({ whatsappUrl });
    } catch (error) {
      res.status(500).json({ message: "Failed to process WhatsApp request" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "client", "dist"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 800
    // REMOVE THE ENTIRE rollupOptions SECTION!
    // Let Vite handle chunking automatically
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "..", "client", "dist");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
dotenv.config();
var app = express2();
app.use(cors({
  origin: [
    "http://localhost:3000",
    // Local dev
    "http://195.250.21.5",
    // Your Ubuntu server IP
    "https://privcelebrations.com"
    // Your production domain
  ],
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true
}));
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "3000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
