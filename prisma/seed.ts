import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Local SVG for layout / OG tests; two entries on first product demo horizontal gallery. */
const DUMMY_PRODUCT_IMAGE = "/placeholders/product-dummy.svg";

function marketplaceLinks(slug: string) {
  const q = encodeURIComponent(`Tuvy ${slug}`);
  return {
    amazon: `https://www.amazon.in/s?k=${q}`,
    flipkart: `https://www.flipkart.com/search?q=${q}`,
    instamart: "https://www.swiggy.com/instamart",
    blinkit: "https://blinkit.com/",
    zepto: "https://www.zepto.in/",
    bigbasket: "https://www.bigbasket.com/ps/?q=tuvy",
    jiomart: "https://www.jiomart.com/search/tuvy",
    nykaa: "https://www.nykaa.com/search/result?q=tuvy",
    dmart: "https://www.dmart.in/",
  };
}

async function main() {
  const products = [
    {
      name: "Chopper",
      slug: "chopper",
      blurb: "Dice vegetables in seconds—less mess, more meals.",
      price: "₹1,299",
      tag: "Bestseller",
      sortOrder: 0,
      images: JSON.stringify([DUMMY_PRODUCT_IMAGE, DUMMY_PRODUCT_IMAGE]),
      retailers: JSON.stringify(marketplaceLinks("Chopper")),
    },
    {
      name: "Oil Sprayer",
      slug: "oil-sprayer",
      blurb: "Even mist for air-fryers, salads, and sheet pans.",
      price: "₹899",
      tag: "New",
      sortOrder: 1,
      images: JSON.stringify([DUMMY_PRODUCT_IMAGE]),
      retailers: JSON.stringify(marketplaceLinks("Oil Sprayer")),
    },
    {
      name: "Storage Box",
      slug: "storage-box",
      blurb: "Stackable clarity for pantries and fridge shelves.",
      price: "₹649",
      tag: "Top rated",
      sortOrder: 2,
      images: JSON.stringify([DUMMY_PRODUCT_IMAGE]),
      retailers: JSON.stringify(marketplaceLinks("Storage Box")),
    },
    {
      name: "Cleaning Tool",
      slug: "cleaning-tool",
      blurb: "Reach corners fast—rinse, wipe, done.",
      price: "₹499",
      tag: "Essential",
      sortOrder: 3,
      images: JSON.stringify([DUMMY_PRODUCT_IMAGE]),
      retailers: JSON.stringify(marketplaceLinks("Cleaning Tool")),
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      create: p,
      update: {
        name: p.name,
        blurb: p.blurb,
        price: p.price,
        tag: p.tag,
        sortOrder: p.sortOrder,
        images: p.images,
        retailers: p.retailers,
      },
    });
  }

  const welcome = {
    slug: "welcome-to-tuvy",
    title: "Welcome to Tuvy — kitchen wins in 10 minutes",
    excerpt: "How we think about tidy utility for real weeknights.",
    contentHtml:
      "<p>Tuvy stands for <strong>Tidy</strong> and <strong>Utility</strong>. This is a sample post from the admin blog editor.</p><h2>What to do next</h2><p>Edit this post in <code>/admin/blog</code> or publish a new guide for your customers.</p>",
    status: "published",
    publishedAt: new Date(),
    metaTitle: "Welcome to Tuvy — kitchen wins in 10 minutes",
    metaDescription: "Meet Tuvy: tidy utility tools for faster, calmer weeknight cooking.",
  };

  await prisma.blogPost.upsert({
    where: { slug: welcome.slug },
    create: welcome,
    update: {
      title: welcome.title,
      excerpt: welcome.excerpt,
      contentHtml: welcome.contentHtml,
      status: welcome.status,
      publishedAt: welcome.publishedAt,
      metaTitle: welcome.metaTitle,
      metaDescription: welcome.metaDescription,
    },
  });

  console.log("Seed complete: products + sample blog post.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
