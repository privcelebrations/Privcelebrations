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
      'Our premium suite featuring Capacity up to 6 - Max Capacity 10 - 2299 ( Includes Decor, extra person 299)',
    capacity: 8,
    basePrice: '2299.00',
    imageUrl:
      '/images/theatres/overthemoon.jpg',
    additionalImages: [ // ADD ADDITIONAL IMAGES
      '/images/theatres/overthemoon.jpg',
      '/images/theatres/overthemoon1.jpg',
      '/images/theatres/overthemoon2.jpg',
      '/images/theatres/overthemoon3.jpg',
      '/images/theatres/overthemoon4.jpg',
      '/images/theatres/overthemoon5.jpg'
    ],
    amenities: ['Capacity up to 6 - Max Capacity 10 - 2299 ( Includes Decor, extra person 299)', '3-hour experience', 'Food and Beverages can be ordered at the theatre.'],
    rating: '5.0',
    duration: '3-hour experience',
  },
  {
    name: 'Velvet Amour',
    description:
      'Intimate setting for 2 guests with love seats, Capacity up to 2 - Max Capacity 6 - 1699 (Includes Love Decor, extra person 299)',
    capacity: 4,
    basePrice: '1699.00',
    imageUrl:
      '/images/theatres/otm.jpg',
    additionalImages: [ // ADD ADDITIONAL IMAGES
      '/images/theatres/otm.jpg',
      '/images/theatres/otm1.jpg',
      '/images/theatres/otm2.jpg',
      '/images/theatres/otm3.jpg',
      '/images/theatres/otm4.jpg',
      '/images/theatres/otm5.jpg'
    ],
    amenities: ['Capacity up to 2 - Max Capacity 6 - 1699 ( Includes Love Decor, extra person 299)', '3-hour experience', 'Perfect for date nights', 'Food and Beverages can be ordered at the theatre.'],
    rating: '5.0',
    duration: '3-hour experience',
  },
  {
    name: 'Golden Imperial',
    description:
      'Spacious theatre for larger groups with tiered seating, popcorn station, and party decorations',
    capacity: 20,
    basePrice: '3699.00',
    imageUrl:
      '/images/theatres/grand.jpg',
    additionalImages: [ // ADD ADDITIONAL IMAGES
      '/images/theatres/grand.jpg',
      '/images/theatres/grand1.jpg',
      '/images/theatres/grand2.jpg',
      '/images/theatres/grand3.jpg',
      '/images/theatres/grand4.jpg',
      '/images/theatres/grand5.jpg'
    ],
    amenities: ['Capacity upto 10 - Max capacity 20 - 3699 ( which includes decor, extra person 299)', '3-hour experience', 'Great for celebrations', 'Food and Beverages can be ordered at the theatre.'],
    rating: '5',
    duration: '3-hour experience',
  },
];

const packageData = [
 
   {
    name: 'Fog Effect (Grand entry)',
    description: 'Fog Special Effect (Grand entry)',
    price: '899.00',
    icon: 'fas fa-smog',
    features: [
      'Fog Effect',
      ],
  },
  {
    name: 'Photo Clippings (16 Pics)',
    description: 'Photo Clippings (16 Pics)',
    price: '449.00',
    icon: 'fas fa-camera-retro',
    features: ['Photo Clippings (16 Pics)'],
  },  
  {
    name: 'Party Props',
    description: 'Party Props',
    price: '149.00',
    icon: 'fas fa-gifts',
    features: ['Party Props'],
  },
  {
    name: 'Karaoke',
    description: 'Karaoke',
    price: '349.00',
    icon: 'fas fa-microphone',
    features: ['Karaoke'],
  },
  {
    name: 'LED Number',
    description: 'LED Number',
    price: '99.00',
    icon: 'fas fa-lightbulb',
    features: ['LED Number'],
  },
  {
    name: 'LED Alphabets',
    description: 'LED Alphabets',
    price: '99.00',
    icon: 'fas fa-font',
    features: ['LED Alphabets'],
  },
  {
    name: 'Sash',
    description: 'Sash',
    price: '149.00',
    icon: 'fas fa-ribbon',
    features: ['Sash'],
  },
  {
    name: 'Rose petals heart',
    description: 'Rose petals heart',
    price: '199.00',
    icon: 'fas fa-heart',
    features: ['Rose petals heart'],
  },
  {
    name: 'Rose petals walkway',
    description: 'Rose petals walkway',
    price: '249.00',
    icon: 'fas fa-route',
    features: ['Rose petals walkway'],
  },
  {
    name: 'Cold fire entry',
    description: 'Cold fire entry',
    price: '999.00',
    icon: 'fas fa-fire',
    features: ['Cold fire entry'],
  },
  {
    name: 'Photography - 1 hour',
    description: "Photography - 1 hour",
    price: '1199.00',
    icon: 'fas fa-camera-retro',
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
    icon: 'fas fa-users',
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

async function ensureTheatreExists(t: typeof theatreData[number]) {
  const found = await db.query.theatres.findFirst({
    where: eq(theatres.name, t.name),
  });

  if (found) {
    console.log(`↩️ Updating theatre (exists): ${t.name}`);
    await db.update(theatres)
      .set({
        description: t.description,
        capacity: t.capacity,
        basePrice: t.basePrice,
        imageUrl: t.imageUrl,
        additionalImages: t.additionalImages,
        amenities: t.amenities,
        rating: t.rating,
        duration: t.duration,
      })
      .where(eq(theatres.name, t.name));
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
    console.log(`↩️ Updating package (exists): ${p.name}`);
    await db.update(packages)
      .set({
        description: p.description,
        price: p.price,
        icon: p.icon,
        features: p.features,
      })
      .where(eq(packages.name, p.name));
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
