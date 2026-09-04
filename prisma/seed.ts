import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MOCK_CATEGORIES = [
  { id: "c1", name: "Electronics", slug: "electronics", imageUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800" },
  { id: "c2", name: "Fashion", slug: "fashion", imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800" },
  { id: "c3", name: "Home & Living", slug: "home-living", imageUrl: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&q=80&w=800" },
  { id: "c4", name: "Beauty", slug: "beauty", imageUrl: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800" },
];

const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Minimalist Watch",
    slug: "minimalist-watch",
    description: "An elegant timepiece for everyday wear. Featuring a clean, unadorned dial and a premium leather strap, this watch is designed for those who appreciate understated style. The stainless steel case ensures durability while maintaining a slim profile.",
    price: 19999,
    originalPrice: 24999,
    categoryName: "Accessories",
    brand: "Lumine",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.8,
    reviewCount: 124,
    isTrending: true,
    isNew: false,
    stock: 45,
    features: [
      "Sapphire crystal glass",
      "Genuine leather strap",
      "Water resistant up to 30m",
      "Quartz movement",
      "Minimalist 40mm dial"
    ],
    specifications: {
      "Brand": "Lumine",
      "Model": "M-Series 01",
      "Case Material": "Stainless Steel",
      "Strap": "Genuine Leather",
      "Water Resistance": "3 ATM (30m)",
      "Warranty": "2 Years"
    },
    shipping: {
      estimatedDays: "2–4 business days",
      cost: 0
    },
    variants: [
      { id: "v1-black", name: "Black", type: "color", value: "#000000", inventory: 20 },
      { id: "v1-brown", name: "Brown", type: "color", value: "#8B4513", inventory: 25 }
    ]
  },
  {
    id: "2",
    name: "Ceramic Coffee Mug",
    slug: "ceramic-coffee-mug",
    description: "Handcrafted ceramic mug with a smooth matte finish. Perfect for your morning coffee or evening tea, this mug holds heat beautifully and feels incredibly satisfying in the hand.",
    price: 2400,
    originalPrice: null,
    categoryName: "Home & Living",
    brand: "Artisan Earth",
    imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.9,
    reviewCount: 56,
    isTrending: true,
    isNew: true,
    stock: 112,
    features: [
      "Handcrafted design",
      "Microwave safe",
      "Dishwasher safe",
      "12oz capacity"
    ],
    specifications: {
      "Material": "Ceramic",
      "Capacity": "12oz (350ml)",
      "Weight": "320g",
      "Care": "Dishwasher & Microwave Safe"
    },
    shipping: {
      estimatedDays: "3–5 business days",
      cost: 5
    },
    variants: []
  },
  {
    id: "3",
    name: "Leather Weekend Bag",
    slug: "leather-weekend-bag",
    description: "Premium full-grain leather duffel bag. Designed for the perfect weekend getaway, it features a spacious interior, durable brass hardware, and a reinforced bottom for extra protection.",
    price: 34950,
    originalPrice: null,
    categoryName: "Fashion",
    brand: "Nomad",
    imageUrl: "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.7,
    reviewCount: 89,
    isTrending: true,
    isNew: false,
    stock: 12,
    features: [
      "Full-grain cowhide leather",
      "Solid brass hardware",
      "Removable shoulder strap",
      "Cabin-size friendly",
      "Interior zip pocket"
    ],
    specifications: {
      "Material": "Full-grain Leather",
      "Dimensions": "20\" x 10\" x 11\"",
      "Weight": "4.2 lbs",
      "Hardware": "Brass"
    },
    shipping: {
      estimatedDays: "2–3 business days",
      cost: 0
    },
    variants: []
  },
  {
    id: "4",
    name: "Noise-Cancelling Headphones",
    slug: "premium-wireless-headphones",
    description: "Immersive sound with industry-leading noise cancellation. Escape the noise and dive deep into your music with our most advanced acoustic technology yet. Featuring 40 hours of battery life and extreme comfort.",
    price: 29900,
    originalPrice: 34900,
    categoryName: "Electronics",
    brand: "Aura Audio",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.9,
    reviewCount: 432,
    isTrending: true,
    isNew: false,
    stock: 5,
    features: [
      "Active Noise Cancellation",
      "40-hour battery life",
      "Bluetooth 5.3",
      "Fast charging (15 min = 3 hours)",
      "Comfortable lightweight design"
    ],
    specifications: {
      "Brand": "Aura Audio",
      "Model": "X100",
      "Connectivity": "Bluetooth 5.3 / 3.5mm Aux",
      "Battery Life": "Up to 40 Hours",
      "Charging": "USB-C",
      "Weight": "280g"
    },
    shipping: {
      estimatedDays: "1–2 business days",
      cost: 0
    },
    variants: [
      { id: "v4-silver", name: "Silver", type: "color", value: "#e5e7eb", inventory: 2 },
      { id: "v4-black", name: "Midnight Black", type: "color", value: "#1f2937", inventory: 3 }
    ]
  },
  {
    id: "5",
    name: "Mechanical Keyboard",
    slug: "mechanical-keyboard",
    description: "Premium wireless mechanical keyboard with tactile switches.",
    price: 14999,
    originalPrice: null,
    categoryName: "Electronics",
    brand: "Keychron",
    imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1511467687858-23d3ce510f27?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.8,
    reviewCount: 312,
    isTrending: false,
    isNew: false,
    stock: 50,
    features: [],
    specifications: {},
    shipping: {},
    variants: []
  },
  {
    id: "6",
    name: "Scented Soy Candle",
    slug: "scented-soy-candle",
    description: "Hand-poured soy candle with calming lavender and vanilla notes.",
    price: 2800,
    originalPrice: null,
    categoryName: "Home & Living",
    brand: "Aura",
    imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1602874801007-bd458cb6c975?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.9,
    reviewCount: 156,
    isTrending: true,
    isNew: false,
    stock: 200,
    features: [],
    specifications: {},
    shipping: {},
    variants: []
  },
  {
    id: "7",
    name: "Linen Button-Up Shirt",
    slug: "linen-button-up-shirt",
    description: "Breathable, lightweight 100% linen shirt perfect for summer.",
    price: 7500,
    originalPrice: 9500,
    categoryName: "Fashion",
    brand: "Nomad",
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.6,
    reviewCount: 89,
    isTrending: false,
    isNew: true,
    stock: 35,
    features: [],
    specifications: {},
    shipping: {},
    variants: []
  }
];

async function main() {
  console.log('Seeding categories...');
  for (const cat of MOCK_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        imageUrl: cat.imageUrl,
      },
    });
  }

  // Adding the missing 'Accessories' category since it wasn't in MOCK_CATEGORIES explicitly but was in products
  await prisma.category.upsert({
    where: { slug: 'accessories' },
    update: {},
    create: {
      id: 'c5',
      name: 'Accessories',
      slug: 'accessories',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    },
  });

  const categories = await prisma.category.findMany();
  const categoryMap = new Map(categories.map((c) => [c.name, c.id]));

  console.log('Seeding products...');
  for (const prod of MOCK_PRODUCTS) {
    const categoryId = categoryMap.get(prod.categoryName);
    if (!categoryId) {
      console.log(\`Warning: Category \${prod.categoryName} not found for product \${prod.name}\`);
      continue;
    }

    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: {
        id: prod.id,
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        price: prod.price,
        originalPrice: prod.originalPrice,
        brand: prod.brand,
        imageUrl: prod.imageUrl,
        images: prod.images,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
        isTrending: prod.isTrending,
        isNew: prod.isNew,
        stock: prod.stock,
        features: prod.features,
        specifications: prod.specifications,
        shipping: prod.shipping,
        variants: prod.variants,
        categoryId: categoryId,
      },
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
