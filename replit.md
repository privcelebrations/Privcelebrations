# CinePrivé - Private Theatre Booking Platform

## Overview

CinePrivé is a luxury private theatre booking platform that allows customers to reserve exclusive cinema experiences for special occasions. The application features premium theatre rooms with customizable packages, real-time booking management, and integrated WhatsApp support for customer service. It's designed as a full-stack web application with a focus on elegant UI/UX and seamless booking workflows.

## Recent Changes (January 2025)

- ✅ **Calendar Date Picker Integration**: Replaced basic HTML date input with an elegant calendar component featuring theatre-themed styling and popover functionality
- ✅ **Gallery Section Addition**: Added comprehensive Gallery section with 6 high-quality images showcasing theatre interiors, catering services, and event setups
- ✅ **Navigation Enhancement**: Updated navigation menu (desktop and mobile) and footer to include Gallery tab
- ✅ **Visual Gallery Features**: Implemented hover effects, image scaling, descriptive overlays, and virtual tour call-to-action button
- ✅ **Domain Integration**: Updated entire application to use actual domain name "privcelebrations.com" including metadata, contact information, and deployment configuration
- ✅ **Database Integration**: Implemented complete PostgreSQL database integration with Drizzle ORM, migration scripts, and production deployment tools
- ✅ **Admin Dashboard**: Created comprehensive admin interface at /admin for booking and contact management with real-time status updates

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and developer experience
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom theatre-themed color variables and responsive design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Form Handling**: React Hook Form with Zod schema validation for type-safe form processing
- **Date Selection**: React Day Picker with Calendar component for enhanced date selection experience
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript throughout the stack for consistency and type safety
- **Storage Strategy**: In-memory storage with interface-based design for easy database migration
- **API Design**: RESTful endpoints for theatres, packages, bookings, and contact management
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Development**: Hot module replacement and automatic restart during development

### Data Storage Solutions
- **Production**: PostgreSQL database with Drizzle ORM for persistent storage and type safety
- **Development**: Automatic fallback to in-memory storage when DATABASE_URL not available
- **Schema Management**: Complete database schema with relations, indexes, and validation
- **Migration System**: Automated database migrations with seeding scripts and backup procedures
- **Dual Support**: MySQL compatibility for cPanel hosting environments

### Component Architecture
- **Design System**: Shadcn/ui with customized theatre-themed styling
- **Component Structure**: Modular components with clear separation of concerns
- **Responsive Design**: Mobile-first approach with desktop optimizations
- **Accessibility**: Built on Radix UI primitives ensuring WCAG compliance
- **Theming**: CSS custom properties for consistent color schemes and spacing
- **Gallery System**: Interactive image gallery with hover effects and overlay descriptions
- **Enhanced Forms**: Calendar-based date picker with popover functionality and theatre theming

### API Structure
- **RESTful Design**: Standard HTTP methods with consistent response formats
- **Endpoint Organization**: 
  - `/api/theatres` - Theatre listing and details
  - `/api/packages` - Add-on package management
  - `/api/bookings` - Booking creation and status management
  - `/api/contacts` - Contact form submissions
- **Data Validation**: Zod schemas for request/response validation
- **Error Responses**: Standardized error format with descriptive messages

## External Dependencies

### Database & ORM
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect
- **Neon Database**: Serverless PostgreSQL for production deployment
- **Connection Management**: Environment-based database URL configuration

### UI & Design
- **Radix UI**: Comprehensive component primitives for accessibility and functionality
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Lucide React**: Icon library for consistent iconography
- **Font Integration**: Google Fonts (Playfair Display, Inter, Cinzel) for premium typography

### Development Tools
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: Schema validation for type-safe data handling
- **Replit Integration**: Development environment with hot reloading and error overlay

### Communication & Integration
- **WhatsApp Business API**: Direct customer communication integration
- **React Helmet**: SEO optimization and meta tag management
- **Font Awesome**: Icon library for social media and UI elements

### Build & Development
- **Vite**: Modern build tool with fast HMR and optimized bundling
- **ESBuild**: Fast JavaScript bundler for production builds
- **TypeScript**: Static type checking across the entire application stack
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer plugins