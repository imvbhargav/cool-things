import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with products...');

  for (let i = 0; i < 100; i++) {

    const product = {
      name: faker.commerce.productName(),
      desc: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 10, max: 1000, dec: 2 })),
      stock: faker.number.int({ min: 1, max: 100 }),
      image: faker.image.url(),
      fullinfo: faker.commerce.productDescription(),
      cateName: faker.commerce.product(),
      sellerId: 'cm7201hfv000m3u0w0cs7h7yi',
    }

    console.log(product.cateName);

    const cate = await prisma.category.upsert({
      where: {
        name: product.cateName,
      },
      update: {},
      create: {
        name: product.cateName,
      }
    });

    console.log("Category created: ", cate);

    await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        desc: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 10, max: 1000, dec: 2 })),
        stock: faker.number.int({ min: 1, max: 100 }),
        image: faker.image.url(),
        fullinfo: faker.commerce.productDescription(),
        cateName: cate.name,
        sellerId: 'cm7c0vjd10032zw0v29ft8xor',
      },
    });
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });