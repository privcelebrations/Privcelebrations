// scripts/seed-database.ts
/**
 * Idempotent DB seeder for Privcelebrations
 *
 * - Checks for existing records by `name` and inserts only when missing.
 * - Does NOT clear production data.
 * - Safe to run repeatedly (e.g. during deploy).
 */

// import 'dotenv/config';
import { db } from '../server/db';
import { theatres, packages, addons } from '../shared/schema';
import { eq } from 'drizzle-orm';

// Basic safety: require DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set. Aborting seed.');
  process.exit(1);
}

const theatreData = [
  {
    name: 'Imperial Suite',
    description:
      'Our premium suite featuring 8 luxury recliners, personal wait service',
    capacity: 8,
    basePrice: '2699.00',
    imageUrl:
      '/images/theatres/overthemoon.jpg',
    amenities: ['Up to 8 guests', '3-hour experience', 'Food &amp; Beverages can be ordered at the theatre.'],
    rating: '5.0',
    duration: '3-hour experience',
  },
  {
    name: 'Royal Chamber',
    description:
      'Intimate setting for 4 guests with love seats, personal concierge, and gourmet snack service',
    capacity: 4,
    basePrice: '1699.00',
    imageUrl:
      '/images/theatres/otm.jpg',
    amenities: ['Up to 8 guests', '2.5-hour experience', 'Perfect for date nights', 'Food &amp; Beverages can be ordered at the theatre.'],
    rating: '5.0',
    duration: '3-hour experience',
  },
  {
    name: 'Grand Auditorium',
    description:
      'Spacious theatre for larger groups with tiered seating, popcorn station, and party decorations',
    capacity: 20,
    basePrice: '3699.00',
    imageUrl:
      '/images/theatres/grand.jpg',
    amenities: ['Up to 20 guests', '3-hour experience', 'Great for celebrations', 'Food &amp; Beverages can be ordered at the theatre.'],
    rating: '4.9',
    duration: '3-hour experience',
  },
];

const packageData = [
  {
    name: 'Minimal Combo @ 20% off (INR 1899)',
    description:
      'Minimal Combo @ 20% off (Rs. 1899/-) Make their special day unforgettable with personalized decorations and treats',
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
    name: 'Kiddo Combo @ 20% off (INR 3199)',
    description: ' Kiddo Combo @ 20% off (Rs. 3199/-) ',
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
    name: 'Family Combo @ 20% off (INR 3299)',
    description:
      'Family Combo @ 20% off (Rs. 3299/-) ',
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
];

async function ensureTheatreExists(t: typeof theatreData[number]) {
  const found = await db.query.theatres.findFirst({
    where: eq(theatres.name, t.name),
  });

  if (found) {
    console.log(`↩️ Skipping theatre (exists): ${t.name}`);
    return;
  }

  await db.insert(theatres).values(t);
  console.log(`✅ Inserted theatre: ${t.name}`);
}

async function ensurePackageExists(p: typeof packageData[number]) {
  const found = await db.query.packages.findFirst({
    where: eq(packages.name, p.name),
  });

  if (found) {
    console.log(`↩️ Skipping package (exists): ${p.name}`);
    return;
  }

  await db.insert(packages).values(p);
  console.log(`✅ Inserted package: ${p.name}`);
}

export async function seedDatabase() {
  console.log('🌱 Starting idempotent database seed...');

  try {
    // In development you might want to clear and reseed; keep production untouched.
    if (process.env.NODE_ENV !== 'production') {
      console.log('⚠️ Non-production environment detected. Development reseed: clearing tables first.');
      // Clear dev data before repopulating so running locally is predictable
      await db.delete(packages);
      await db.delete(theatres);
    }

    // Theatres
    for (const t of theatreData) {
      await ensureTheatreExists(t);
    }

    // Packages
    for (const p of packageData) {
      await ensurePackageExists(p);
    }

    console.log('🎉 Seeding complete.');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    throw err;
  }
}

// Run when executed directly (node / tsx scripts/seed-database.ts)
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seed script finished.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Seed script error:', err);
      process.exit(1);
    });
}
