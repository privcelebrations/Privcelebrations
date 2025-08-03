import { db } from '../server/db';
import { theatres, packages } from '../shared/schema';

const seedDatabase = async () => {
  console.log('🌱 Seeding production database...');
  
  try {
    // Clear existing data (development only)
    if (process.env.NODE_ENV !== 'production') {
      await db.delete(packages);
      await db.delete(theatres);
    }

    // Insert theatres
    const theatreData = [
      {
        name: "Imperial Suite",
        description: "Our premium suite featuring 12 luxury recliners, personal wait service, and champagne bar",
        capacity: 12,
        basePrice: "899.00",
        imageUrl: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        amenities: ["Up to 12 guests", "3-hour experience", "Premium catering included"],
        rating: "5.0",
        duration: "3-hour experience"
      },
      {
        name: "Royal Chamber",
        description: "Intimate setting for 8 guests with love seats, personal concierge, and gourmet snack service",
        capacity: 8,
        basePrice: "649.00",
        imageUrl: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        amenities: ["Up to 8 guests", "2.5-hour experience", "Perfect for date nights"],
        rating: "5.0",
        duration: "2.5-hour experience"
      },
      {
        name: "Grand Auditorium",
        description: "Spacious theatre for larger groups with tiered seating, popcorn station, and party decorations",
        capacity: 20,
        basePrice: "1299.00",
        imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        amenities: ["Up to 20 guests", "4-hour experience", "Great for celebrations"],
        rating: "4.9",
        duration: "4-hour experience"
      }
    ];

    await db.insert(theatres).values(theatreData);
    console.log('✅ Theatres seeded successfully');
    
    // Insert packages
    const packageData = [
      {
        name: "Birthday Celebration",
        description: "Make their special day unforgettable with personalized decorations and birthday treats",
        price: "199.00",
        icon: "fas fa-birthday-cake",
        features: ["Custom birthday decorations", "Special birthday cake", "Personalized playlist", "Party favors for guests"]
      },
      {
        name: "Anniversary Romance",
        description: "Celebrate your love story with romantic ambiance and champagne service",
        price: "249.00",
        icon: "fas fa-heart",
        features: ["Rose petal decorations", "Champagne bottle service", "Romantic lighting setup", "Custom photo slideshow"]
      },
      {
        name: "Corporate Event",
        description: "Professional networking events with premium catering and presentation capabilities",
        price: "399.00",
        icon: "fas fa-briefcase",
        features: ["Professional setup & branding", "Executive catering menu", "Presentation equipment", "Networking refreshments"]
      },
      {
        name: "Premium Catering",
        description: "Gourmet dining experience with chef-prepared meals and beverage service",
        price: "299.00",
        icon: "fas fa-utensils",
        features: ["5-course gourmet meal", "Wine pairing selection", "Professional service staff", "Custom menu options"]
      },
      {
        name: "Entertainment Plus",
        description: "Enhanced audio-visual experience with gaming setup and premium sound",
        price: "179.00",
        icon: "fas fa-gamepad",
        features: ["Gaming console setup", "Premium surround sound", "Karaoke system", "Interactive entertainment"]
      },
      {
        name: "Kids Party Special",
        description: "Fun-filled celebration package designed specifically for children's parties",
        price: "229.00",
        icon: "fas fa-child",
        features: ["Kid-friendly decorations", "Children's movie selection", "Party games & activities", "Special kids menu"]
      }
    ];

    await db.insert(packages).values(packageData);
    console.log('✅ Packages seeded successfully');
    
    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => process.exit(0));
}

export { seedDatabase };