const { PrismaClient } = require("@prisma/client");
const { loadEnv } = require("../src/config/env");

loadEnv();

const prisma = new PrismaClient();

const demoProducts = [
  {
    name: "Wireless Mouse",
    description: "Ergonomic 2.4GHz wireless mouse with silent clicks.",
    price: 19.99,
    imageUrl: "https://www.lemokey.com/cdn/shop/files/Lemokey-G1-wireless-mouse-black.jpg?v=1721803330&width=713"
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB backlit mechanical keyboard, blue switches.",
    price: 89.5,
    imageUrl: "https://cdn.thewirecutter.com/wp-content/media/2025/12/BEST-MECHANICAL-KEYBOARDS-2048px-EVOWORKS-80-926.jpg?width=2048&quality=60&crop=2048:1365&auto=webp"
  },
  {
    name: "USB-C Hub",
    description: "7-in-1 hub with HDMI, USB 3.0, and SD card reader.",
    price: 45.0,
    imageUrl: "https://static.tp-link.com/upload/image-line/UH3020C_UN_1.0_overview_01_large_20241210015321r.jpg"
  },
  {
    name: "Laptop Stand",
    description: "Aluminum adjustable stand for 13–17 inch laptops.",
    price: 34.99,
    imageUrl: "https://netphukien.com/wp-content/uploads/Ki%CC%81ch-co%CC%9B%CC%83-1.jpg"
  },
  {
    name: "Webcam HD",
    description: "1080p autofocus webcam with stereo microphones.",
    price: 59.0,
    imageUrl: "https://gtctelecom.vn/uploads/images/san-pham/tong-dai-ip/camera-hoi-nghi-logitech-brio.jpg"
  },
  {
    name: "Noise-Canceling Headphones",
    description: "Over-ear Bluetooth headphones, 30h battery.",
    price: 129.99,
    imageUrl: "https://labgroup.com.vn/img/products/tai-nghe-call-center-jabra-biz-1100-duo-usb0-600x470-2.jpg"
  },
  {
    name: "Portable SSD 1TB",
    description: "USB 3.2 Gen 2 portable solid state drive.",
    price: 99.99,
    imageUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/e/x/extreme-usb-3-2-ssd-front.png.wd_1.png"
  },
  {
    name: "Desk Lamp LED",
    description: "Dimmable LED lamp with warm and cool modes.",
    price: 27.5,
    imageUrl: "https://bizweb.dktcdn.net/thumb/1024x1024/100/422/317/products/hhlt0617-1-copy.jpg?v=1742890155673"
  },
  {
    name: "Phone Stand",
    description: "Adjustable foldable stand for phones and small tablets.",
    price: 12.99,
    imageUrl: "https://bizweb.dktcdn.net/thumb/grande/100/321/653/products/os19.jpg?v=1701495164057"
  },
  {
    name: "Bluetooth Speaker",
    description: "Compact waterproof speaker, 12h playtime.",
    price: 42.0,
    imageUrl: "https://bizweb.dktcdn.net/thumb/1024x1024/100/459/953/products/apple-homepod-2-white.jpg"
  },
  {
    name: "Gaming Mouse Pad XL",
    description: "Stitched edges, non-slip rubber base.",
    price: 18.0,
    imageUrl: "https://bizweb.dktcdn.net/thumb/grande/100/440/968/products/55861-ban-di-chuot-tyloo-25cm-30cm-01-1-jpg-v-1730095699030.jpg?v=1730121866690"
  },
  {
    name: "HDMI Cable 2m",
    description: "High-speed HDMI 2.1 cable, 4K@120Hz.",
    price: 14.49,
    imageUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/c/a/cap-hdmi-2-0-orico-h8cy-10-bk-8k-60hz-1-met.png"
  },
  {
    name: "Power Strip 6-Outlet",
    description: "Surge protection with two USB-A ports.",
    price: 24.99,
    imageUrl: "https://content.misumi-ec.com/image/upload/t_popover_main/v1/p/cn/product/series/110410659069/110410659069_20230320183643.jpg"
  },
  {
    name: "Laptop Sleeve 15\"",
    description: "Padded neoprene sleeve with accessory pocket.",
    price: 22.0,
    imageUrl: "https://m.media-amazon.com/images/I/71tFkRMgLqL._AC_SX679_.jpg"
  },
  {
    name: "Wireless Charger Pad",
    description: "15W fast charging for Qi-enabled devices.",
    price: 31.75,
    imageUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/e/de-sac-khong-day-momax-ud31_1.png"
  }
];

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: demoProducts
  });

  const count = await prisma.product.count();
  console.log(`Seeded ${count} products.`);

  const demoUser = await prisma.user.findFirst({ orderBy: { id: "asc" } });
  if (demoUser) {
    const picks = await prisma.product.findMany({
      take: 6,
      orderBy: { id: "asc" },
      select: { id: true }
    });
    const comments = [
      "Exactly what I needed.",
      "Solid quality for the price.",
      "Fast shipping, happy with this.",
      "Good value.",
      "Works great!",
      "Would buy again."
    ];
    for (let i = 0; i < picks.length; i += 1) {
      await prisma.review.create({
        data: {
          userId: demoUser.id,
          productId: picks[i].id,
          rating: 3 + (i % 3),
          comment: comments[i % comments.length]
        }
      });
    }
    console.log(`Seeded ${picks.length} demo reviews for user ${demoUser.email}.`);
  } else {
    console.log("No users in DB — skipped demo reviews (register a user, re-seed).");
  }
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
