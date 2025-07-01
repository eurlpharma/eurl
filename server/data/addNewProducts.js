import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';
import connectDB from '../config/db.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// New products data
const newProducts = [
  {
    name: 'Omega-3 Fish Oil',
    slug: 'omega-3-fish-oil',
    description: 'High quality Omega-3 fatty acids from fish oil for heart and brain health',
    richDescription: 'Our Omega-3 Fish Oil supplement provides essential fatty acids that support cardiovascular health, brain function, and joint mobility. Each softgel contains 1000mg of fish oil with high concentrations of EPA and DHA. Sourced from wild-caught fish and purified to remove contaminants.',
    images: ['/images/products/product4.svg'],
    brand: 'OmegaHealth',
    price: 22.99,
    category: null, // Will be set after categories are retrieved
    countInStock: 45,
    rating: 4.7,
    numReviews: 28,
    isFeatured: true,
    isVisible: true,
    specifications: {
      servingSize: '1 softgel',
      servingsPerContainer: 90,
      ingredients: 'Fish oil concentrate, gelatin, glycerin, purified water',
      directions: 'Take 1 softgel daily with food or as directed by your healthcare professional'
    }
  },
  {
    name: 'Magnesium Tablets',
    slug: 'magnesium-tablets',
    description: 'Magnesium supplement for muscle function and nervous system support',
    richDescription: 'Magnesium is an essential mineral that plays a role in over 300 enzymatic reactions in the body. Our high-absorption magnesium tablets support muscle function, nervous system health, and energy production. Each tablet contains 400mg of elemental magnesium in a highly bioavailable form.',
    images: ['/images/products/product5.svg'],
    brand: 'MineralPlus',
    price: 18.50,
    category: null,
    countInStock: 60,
    rating: 4.5,
    numReviews: 42,
    isFeatured: false,
    isVisible: true,
    specifications: {
      servingSize: '1 tablet',
      servingsPerContainer: 120,
      ingredients: 'Magnesium citrate, microcrystalline cellulose, vegetable stearate',
      directions: 'Take 1 tablet daily with a meal or as directed by your healthcare professional'
    }
  },
  {
    name: 'Collagen Peptides',
    slug: 'collagen-peptides',
    description: 'Hydrolyzed collagen powder for skin, hair, nails, and joint health',
    richDescription: 'Our Collagen Peptides powder provides type I and III collagen that supports skin elasticity, hair strength, nail growth, and joint health. This unflavored powder dissolves easily in hot or cold liquids and can be added to coffee, smoothies, or recipes. Sourced from grass-fed, pasture-raised bovine.',
    images: ['/images/products/product6.svg'],
    brand: 'BeautyNutri',
    price: 29.99,
    category: null,
    countInStock: 35,
    rating: 4.8,
    numReviews: 56,
    isFeatured: true,
    isVisible: true,
    specifications: {
      servingSize: '1 scoop (10g)',
      servingsPerContainer: 30,
      ingredients: 'Hydrolyzed bovine collagen peptides',
      directions: 'Mix one scoop with 8 oz of liquid daily. Can be added to hot or cold beverages.'
    }
  },
  {
    name: 'Blood Pressure Monitor',
    slug: 'blood-pressure-monitor',
    description: 'Digital upper arm blood pressure monitor for home use',
    richDescription: 'Our digital blood pressure monitor provides accurate readings of systolic and diastolic blood pressure as well as pulse rate. Features include a large LCD display, irregular heartbeat detection, and memory storage for up to 60 readings. The adjustable cuff fits arm circumferences from 8.7" to 16.5".',
    images: ['/images/products/product7.svg'],
    brand: 'MediTech',
    price: 45.99,
    category: null,
    countInStock: 20,
    rating: 4.6,
    numReviews: 38,
    isFeatured: false,
    isVisible: true,
    specifications: {
      batteryType: '4 AAA batteries (included)',
      dimensions: '5.5" x 4.1" x 2.2"',
      weight: '10.6 oz (without batteries)',
      warranty: '2 years'
    }
  },
  {
    name: 'First Aid Kit',
    slug: 'first-aid-kit',
    description: 'Comprehensive first aid kit for home, office, or travel',
    richDescription: 'Be prepared for minor emergencies with our comprehensive first aid kit. Contains 150 essential items including bandages, antiseptic wipes, gauze pads, medical tape, scissors, tweezers, and more. Comes in a durable, water-resistant case with clear compartments for easy organization.',
    images: ['/images/products/product8.svg'],
    brand: 'SafetyFirst',
    price: 32.50,
    category: null,
    countInStock: 40,
    rating: 4.9,
    numReviews: 75,
    isFeatured: true,
    isVisible: true,
    specifications: {
      itemCount: '150 pieces',
      caseSize: '9" x 6" x 3"',
      weight: '1.5 lbs',
      contents: 'Bandages (various sizes), gauze pads, antiseptic wipes, medical tape, scissors, tweezers, gloves, emergency blanket, and more'
    }
  },
  {
    name: 'Vitamin D Supplements',
    slug: 'vitamin-d-supplements',
    description: 'Vitamin D3 supplements for immune support and bone health',
    richDescription: 'Vitamin D is essential for calcium absorption, immune function, and overall health. Our Vitamin D3 supplements provide 5000 IU (125 mcg) of vitamin D3 (cholecalciferol), the most bioavailable form. These small, easy-to-swallow softgels help maintain optimal vitamin D levels, especially during seasons with limited sun exposure.',
    images: ['/images/products/product9.svg'],
    brand: 'VitaHealth',
    price: 15.99,
    category: null,
    countInStock: 70,
    rating: 4.7,
    numReviews: 62,
    isFeatured: false,
    isVisible: true,
    specifications: {
      servingSize: '1 softgel',
      servingsPerContainer: 365,
      ingredients: 'Vitamin D3 (as cholecalciferol), olive oil, gelatin, glycerin',
      directions: 'Take 1 softgel daily with food or as directed by your healthcare professional'
    }
  },
  {
    name: 'Probiotics Complex',
    slug: 'probiotics-complex',
    description: 'Multi-strain probiotic supplement for gut health and immune support',
    richDescription: "Our Probiotics Complex contains 50 billion CFU of 15 clinically studied probiotic strains that support digestive health, immune function, and overall wellness. The delayed-release capsules protect the probiotics from stomach acid, ensuring they reach the intestines where they're needed most. No refrigeration required.",
    images: ['/images/products/product10.svg'],
    brand: 'GutBiome',
    price: 34.99,
    category: null,
    countInStock: 30,
    rating: 4.6,
    numReviews: 48,
    isFeatured: true,
    isVisible: true,
    specifications: {
      servingSize: '1 capsule',
      servingsPerContainer: 60,
      ingredients: '50 billion CFU probiotic blend (15 strains), vegetable capsule, microcrystalline cellulose',
      directions: 'Take 1 capsule daily with or without food'
    }
  },
  {
    name: 'Zinc Supplements',
    slug: 'zinc-supplements',
    description: 'Zinc tablets for immune support and skin health',
    richDescription: 'Zinc is an essential mineral that plays a vital role in immune function, protein synthesis, wound healing, and DNA synthesis. Our zinc supplements provide 50mg of zinc picolinate, a highly absorbable form. Each tablet is vegetarian-friendly and free from common allergens.',
    images: ['/images/products/product11.svg'],
    brand: 'MineralPlus',
    price: 14.50,
    category: null,
    countInStock: 55,
    rating: 4.4,
    numReviews: 36,
    isFeatured: false,
    isVisible: true,
    specifications: {
      servingSize: '1 tablet',
      servingsPerContainer: 100,
      ingredients: 'Zinc (as zinc picolinate), microcrystalline cellulose, vegetable stearate',
      directions: 'Take 1 tablet daily with food'
    }
  },
  {
    name: 'Hot Water Bottle',
    slug: 'hot-water-bottle',
    description: 'Classic rubber hot water bottle with knitted cover for pain relief',
    richDescription: 'Our hot water bottle provides natural, drug-free relief from muscle aches, menstrual cramps, and cold-weather discomfort. Made from high-quality natural rubber with a secure stopper to prevent leaks. Includes a soft knitted cover that protects your skin from direct heat and keeps the bottle warm longer.',
    images: ['/images/products/product12.svg'],
    brand: 'ComfortCare',
    price: 16.99,
    category: null,
    countInStock: 45,
    rating: 4.8,
    numReviews: 52,
    isFeatured: false,
    isVisible: true,
    specifications: {
      capacity: '2 liters',
      material: 'Natural rubber with knitted polyester cover',
      dimensions: '12" x 7"',
      care: 'Empty after use. Air dry with stopper removed. Cover is machine washable.'
    }
  },
  {
    name: 'Adhesive Bandages',
    slug: 'adhesive-bandages',
    description: 'Flexible fabric adhesive bandages in assorted sizes',
    richDescription: 'Our adhesive bandages provide protection for minor cuts, scrapes, and blisters. Made with a flexible fabric material that moves with your skin and stays in place. The non-stick pad absorbs exudate while keeping the wound moist for optimal healing. Includes 100 bandages in assorted sizes.',
    images: ['/images/products/product13.svg'],
    brand: 'SafetyFirst',
    price: 8.99,
    category: null,
    countInStock: 80,
    rating: 4.5,
    numReviews: 65,
    isFeatured: false,
    isVisible: true,
    specifications: {
      count: '100 bandages',
      sizes: '30 large (3"x1"), 40 medium (2.5"x0.75"), 30 small (1.5"x0.75")',
      material: 'Flexible fabric with non-stick wound pad',
      features: 'Sterile, individually wrapped, latex-free'
    }
  },
  {
    name: 'Digital Stethoscope',
    slug: 'digital-stethoscope',
    description: 'Advanced digital stethoscope with noise cancellation and recording capabilities',
    richDescription: 'Our digital stethoscope combines traditional acoustic stethoscope functionality with advanced digital technology. Features include active noise cancellation, amplification up to 40x, multiple frequency modes for different body sounds, and Bluetooth connectivity to record and share auscultations. Ideal for healthcare professionals and students.',
    images: ['/images/products/product14.svg'],
    brand: 'MediTech',
    price: 199.99,
    category: null,
    countInStock: 10,
    rating: 4.9,
    numReviews: 28,
    isFeatured: true,
    isVisible: true,
    specifications: {
      batteryLife: 'Up to 20 hours of continuous use',
      connectivity: 'Bluetooth 5.0',
      weight: '7.9 oz',
      warranty: '2 years',
      includes: 'Digital stethoscope, ear tips (small/large), USB charging cable, carrying case'
    }
  },
  {
    name: 'Multivitamin Complex',
    slug: 'multivitamin-complex',
    description: 'Comprehensive multivitamin and mineral supplement for daily health support',
    richDescription: 'Our Multivitamin Complex provides essential vitamins and minerals to support overall health and wellbeing. Each tablet contains 23 key nutrients including vitamins A, C, D, E, B-complex, and minerals such as calcium, magnesium, zinc, and selenium. Formulated for optimal absorption and bioavailability.',
    images: ['/images/products/product15.svg'],
    brand: 'VitaHealth',
    price: 24.95,
    category: null,
    countInStock: 60,
    rating: 4.7,
    numReviews: 85,
    isFeatured: true,
    isVisible: true,
    specifications: {
      servingSize: '1 tablet',
      servingsPerContainer: 90,
      ingredients: '23 vitamins and minerals, vegetable cellulose, vegetable stearate',
      directions: 'Take 1 tablet daily with food'
    }
  },
  {
    name: 'Pulse Oximeter',
    slug: 'pulse-oximeter',
    description: 'Fingertip pulse oximeter for measuring blood oxygen saturation and pulse rate',
    richDescription: 'Our fingertip pulse oximeter provides quick and accurate readings of blood oxygen saturation (SpO2) and pulse rate. Features include a bright OLED display with adjustable brightness, automatic power-off, and low battery indicator. Compact and portable design makes it perfect for home use, sports, and travel.',
    images: ['/images/products/product16.svg'],
    brand: 'MediTech',
    price: 29.99,
    category: null,
    countInStock: 35,
    rating: 4.6,
    numReviews: 42,
    isFeatured: false,
    isVisible: true,
    specifications: {
      measurementRange: 'SpO2: 70-99%, Pulse Rate: 30-250 BPM',
      accuracy: 'SpO2: ±2%, Pulse Rate: ±2 BPM',
      batteryType: '2 AAA batteries (included)',
      dimensions: '2.3" x 1.3" x 1.3"',
      weight: '1.8 oz (with batteries)'
    }
  },
  {
    name: 'Glucose Monitor',
    slug: 'glucose-monitor',
    description: 'Blood glucose monitoring system for diabetes management',
    richDescription: 'Our blood glucose monitoring system provides fast and accurate results in just 5 seconds with a small 0.5 µL blood sample. The large backlit display is easy to read, and the device stores up to 500 test results with date and time. Includes the meter, lancing device, 10 lancets, 10 test strips, control solution, and carrying case.',
    images: ['/images/products/product17.svg'],
    brand: 'DiabeteCare',
    price: 49.99,
    category: null,
    countInStock: 25,
    rating: 4.8,
    numReviews: 36,
    isFeatured: true,
    isVisible: true,
    specifications: {
      measurementRange: '20-600 mg/dL',
      sampleSize: '0.5 µL',
      testTime: '5 seconds',
      memory: '500 test results with date and time',
      batteryLife: 'Approximately 1000 tests',
      includes: 'Meter, lancing device, 10 lancets, 10 test strips, control solution, carrying case, user manual'
    }
  },
  {
    name: 'Biotin Supplement',
    slug: 'biotin-supplement',
    description: 'High-potency biotin supplement for hair, skin, and nail health',
    richDescription: 'Biotin (vitamin B7) is essential for maintaining healthy hair, skin, and nails. Our high-potency biotin supplement provides 10,000 mcg of biotin per capsule to support keratin infrastructure and promote healthy growth. These vegetarian capsules are free from common allergens and artificial ingredients.',
    images: ['/images/products/product18.svg'],
    brand: 'BeautyNutri',
    price: 17.95,
    category: null,
    countInStock: 50,
    rating: 4.5,
    numReviews: 58,
    isFeatured: false,
    isVisible: true,
    specifications: {
      servingSize: '1 capsule',
      servingsPerContainer: 120,
      ingredients: 'Biotin (as d-biotin) 10,000 mcg, vegetable cellulose (capsule), rice flour',
      directions: 'Take 1 capsule daily with food or as directed by your healthcare professional'
    }
  }
];

// Import new products
const importNewProducts = async () => {
  try {
    // Get admin user
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      process.exit(1);
    }

    // Get categories
    const categories = await Category.find({});
    
    if (categories.length === 0) {
      process.exit(1);
    }

    // Assign categories to products
    const productsWithCategories = newProducts.map((product, index) => {
      // Assign categories in a round-robin fashion
      const categoryIndex = index % categories.length;
      return {
        ...product,
        category: categories[categoryIndex]._id,
        user: adminUser._id,
      };
    });

    // Import products
    await Product.insertMany(productsWithCategories);

    process.exit();
  } catch (error) {
    process.exit(1);
  }
};

// Run the import
importNewProducts();
