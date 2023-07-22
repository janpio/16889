const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({ log: ['query']})

const { faker } = require('@faker-js/faker');

async function main() {
  // Clean both tableA and tableB
  const tableB1 = await prisma.tableB.deleteMany()
  console.log({ tableB1 })
  const tableA1 = await prisma.tableA.deleteMany()
  console.log({ tableA1 })

  let tableA2 = null
  for (let i = 0; i < 5; i++) {
    tableA2 = await prisma.tableA.create({
      data: {
        // faked email with prisma.io as domain suffix
        colA: faker.internet.email(undefined, undefined, 'prisma.io'),
        tableBs: {
          createMany: {
            data: Array.from({ length: 4500 }).map(() => ({
              colC: faker.location.city(),
              colD: faker.location.country(),
            })),
          },
        },
      },
    })
    console.log({ tableA2 })
  }
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })