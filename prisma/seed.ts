import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;



if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in your environment.");
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({ adapter });

const sampleProducts = [
  // --- Electronics ---
  {
    name: "Wireless Noise-Canceling Headphones",
    description: "Premium over-ear wireless headphones with active noise cancellation, 30-hour battery life, and spatial audio support.",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    stock: 25,
    category: "Electronics",
  },
  {
    name: "Mechanical Gaming Keyboard",
    description: "RGB backlit mechanical keyboard with tactile brown switches, detachable USB-C cable, and durable aluminum top plate.",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    stock: 40,
    category: "Electronics",
  },
  {
    name: "Ergonomic Wireless Mouse",
    description: "Precision laser tracking with dual Bluetooth/2.4GHz connectivity, silent clicks, and an ergonomic thumb rest.",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80",
    stock: 55,
    category: "Electronics",
  },
  {
    name: "Ultra-HD 4K Action Camera",
    description: "Waterproof compact action camera capable of 4K 60fps recording, dual touchscreens, and electronic image stabilization.",
    price: 189.00,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80",
    stock: 18,
    category: "Electronics",
  },
  {
    name: "Portable Bluetooth Speaker",
    description: "Rugged IPX7 waterproof speaker delivering 360-degree sound with deep bass and up to 16 hours of continuous playtime.",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80",
    stock: 35,
    category: "Electronics",
  },

  // --- Apparel & Fashion ---
  {
    name: "Heavyweight Cotton Hoodie",
    description: "Ultra-soft 450 GSM organic French terry cotton hoodie featuring a relaxed streetwear fit and reinforced seams.",
    price: 75.00,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
    stock: 60,
    category: "Apparel",
  },
  {
    name: "Water-Resistant Commuter Backpack",
    description: "Minimalist urban daypack with padded 15.6-inch laptop compartment, hidden security pocket, and weatherproof zippers.",
    price: 89.50,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    stock: 30,
    category: "Apparel",
  },
  {
    name: "Breathable Running Sneakers",
    description: "Lightweight running shoes built with responsive foam cushioning and breathable engineered mesh upper.",
    price: 129.00,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    stock: 45,
    category: "Apparel",
  },
  {
    name: "Vintage Washed Denim Jacket",
    description: "Classic trucker denim jacket in a stone-washed indigo finish with buttoned chest pockets and welt hand pockets.",
    price: 98.00,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80",
    stock: 22,
    category: "Apparel",
  },

  // --- Home & Lifestyle ---
  {
    name: "Ceramic Pour-Over Coffee Set",
    description: "Artisan matte ceramic dripper with heat-resistant borosilicate glass server for handcrafted specialty coffee.",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    stock: 50,
    category: "Home",
  },
  {
    name: "Minimalist LED Desk Lamp",
    description: "Sleek aluminum task lamp with touch brightness dimmer, 3 color temperatures, and integrated 15W Qi wireless charger.",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=800&auto=format&fit=crop&q=80",
    stock: 38,
    category: "Home",
  },
  {
    name: "Aroma Diffuser & Ultrasonic Humidifier",
    description: "Quiet 500ml ultrasonic essential oil diffuser with natural grain finish, 7 ambient LED colors, and auto shut-off.",
    price: 36.99,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80",
    stock: 65,
    category: "Home",
  },
];

async function main() {
  console.log("🌱 Starting database seed...");

  let createdCount = 0;
  let updatedCount = 0;

  for (const item of sampleProducts) {
    const existing = await prisma.product.findFirst({
      where: { name: item.name },
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: item,
      });
      updatedCount++;
    } else {
      await prisma.product.create({
        data: item,
      });
      createdCount++;
    }
  }

  console.log(
    `✅ Seeding complete! Created: ${createdCount} products, Updated: ${updatedCount} products.`
  );
  console.log(`📦 Total sample products in database: ${sampleProducts.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Error while seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
