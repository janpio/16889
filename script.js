const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  // log: [
  //   {
  //     emit: 'event',
  //     level: 'query',
  //   },
  //   {
  //     emit: 'stdout',
  //     level: 'error',
  //   },
  //   {
  //     emit: 'stdout',
  //     level: 'info',
  //   },
  //   {
  //     emit: 'stdout',
  //     level: 'warn',
  //   },
  // ],
})

prisma.$on('query', (e) => {
  // console.log('Query: ' + e.query)
  // console.log('Params: ' + e.params)
  // console.log('Duration: ' + e.duration + 'ms')
})

async function main() {
  const query = 'prisma'
  const queryPattern = `%${query}%`

  console.time('$connect')
  await prisma.$connect()
  console.timeEnd('$connect')
  console.log('------------------')

  for (let i = 0; i < 5; i++) {

    if(i>0) console.time('$queryRaw')
    let raw2 = await prisma.$queryRaw`SELECT "col_A", "col_B", "col_C", "col_D" FROM "table_A" a INNER JOIN "table_B" b on a."a_id" = b."a_id" WHERE "col_A" ILIKE ${queryPattern} or "col_B" ILIKE ${queryPattern}`
    if(i>0)console.timeEnd('$queryRaw')
    // console.log(raw)
    console.log('------------------')

    if(i>0) console.time('findMany')
    let data2 = await prisma.tableA.findMany({
      where: {
        OR: [
          {
            colA: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            colB: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      },
      select: {
        colA: true,
        colB: true,
        tableBs: {
          select: {
            colC: true,
            colD: true
          }
        }
      }
    })
    if(i>0) console.timeEnd('findMany')
    // console log the full object in full depth
    // console.log(JSON.stringify(data, null, 4))
    console.log('------------------')
  }

}

main()