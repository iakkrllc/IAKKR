const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main(){
  const existing = await prisma.user.findUnique({ where: { email: 'owner@example.com' } });
  if (existing) {
    console.log('Owner already exists:', existing.id);
    return;
  }
  const user = await prisma.user.create({ data: { name: 'Owner', email: 'owner@example.com', isOwner: true } });
  console.log('Created owner with id', user.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
