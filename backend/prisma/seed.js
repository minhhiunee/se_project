const { PrismaClient } = require("@prisma/client");
const { loadEnv } = require("../src/config/env");

loadEnv();

const prisma = new PrismaClient();

const demoProducts = [
  {
    name: "Wireless Mouse",
    description: "Ergonomic 2.4GHz wireless mouse with silent clicks.",
    price: 19.99,
    imageUrl: "https://picsum.photos/seed/mouse/400/300"
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB backlit mechanical keyboard, blue switches.",
    price: 89.5,
    imageUrl: "https://picsum.photos/seed/keyboard/400/300"
  },
  {
    name: "USB-C Hub",
    description: "7-in-1 hub with HDMI, USB 3.0, and SD card reader.",
    price: 45.0,
    imageUrl: "https://picsum.photos/seed/hub/400/300"
  },
  {
    name: "Laptop Stand",
    description: "Aluminum adjustable stand for 13–17 inch laptops.",
    price: 34.99,
    imageUrl: "https://picsum.photos/seed/stand/400/300"
  },
  {
    name: "Webcam HD",
    description: "1080p autofocus webcam with stereo microphones.",
    price: 59.0,
    imageUrl: "https://picsum.photos/seed/webcam/400/300"
  },
  {
    name: "Noise-Canceling Headphones",
    description: "Over-ear Bluetooth headphones, 30h battery.",
    price: 129.99,
    imageUrl: "https://picsum.photos/seed/headphones/400/300"
  },
  {
    name: "Portable SSD 1TB",
    description: "USB 3.2 Gen 2 portable solid state drive.",
    price: 99.99,
    imageUrl: "https://picsum.photos/seed/ssd/400/300"
  },
  {
    name: "Desk Lamp LED",
    description: "Dimmable LED lamp with warm and cool modes.",
    price: 27.5,
    imageUrl: "https://picsum.photos/seed/lamp/400/300"
  },
  {
    name: "Phone Stand",
    description: "Adjustable foldable stand for phones and small tablets.",
    price: 12.99,
    imageUrl: "https://picsum.photos/seed/phonestand/400/300"
  },
  {
    name: "Bluetooth Speaker",
    description: "Compact waterproof speaker, 12h playtime.",
    price: 42.0,
    imageUrl: "https://picsum.photos/seed/speaker/400/300"
  },
  {
    name: "Gaming Mouse Pad XL",
    description: "Stitched edges, non-slip rubber base.",
    price: 18.0,
    imageUrl: "https://picsum.photos/seed/mousepad/400/300"
  },
  {
    name: "HDMI Cable 2m",
    description: "High-speed HDMI 2.1 cable, 4K@120Hz.",
    price: 14.49,
    imageUrl: "https://picsum.photos/seed/hdmi/400/300"
  },
  {
    name: "Power Strip 6-Outlet",
    description: "Surge protection with two USB-A ports.",
    price: 24.99,
    imageUrl: "https://picsum.photos/seed/powerstrip/400/300"
  },
  {
    name: "Laptop Sleeve 15\"",
    description: "Padded neoprene sleeve with accessory pocket.",
    price: 22.0,
    imageUrl: "https://picsum.photos/seed/sleeve/400/300"
  },
  {
    name: "Wireless Charger Pad",
    description: "15W fast charging for Qi-enabled devices.",
    price: 31.75,
    imageUrl: "https://picsum.photos/seed/charger/400/300"
  }
];

async function main() {
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: demoProducts
  });

  const count = await prisma.product.count();
  console.log(`Seeded ${count} products.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
