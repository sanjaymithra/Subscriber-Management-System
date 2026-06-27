import bcrypt from 'bcrypt'
import { fileURLToPath } from 'node:url'
import { prisma } from '../../database/prisma.js'
import { logger } from '../../utils/logger.js'

const DEMO_USERS = [
  {
    email: 'admin@demo.com',
    password: 'admin123',
    role: 'Admin',
  },
  {
    email: 'manager@demo.com',
    password: 'manager123',
    role: 'Manager',
  },
  {
    email: 'staff@demo.com',
    password: 'staff123',
    role: 'Staff',
  },
] as const

export async function seedDemoUsers() {
  const seededEmails: string[] = []
  const existingEmails: string[] = []

  for (const demoUser of DEMO_USERS) {
    const email = demoUser.email.trim().toLowerCase()
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      existingEmails.push(email)
      continue
    }

    const passwordHash = await bcrypt.hash(demoUser.password, 12)

    await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: demoUser.role,
      },
    })

    seededEmails.push(email)
  }

  const users = await prisma.user.findMany({
    where: {
      email: {
        in: DEMO_USERS.map((demoUser) => demoUser.email),
      },
    },
    orderBy: {
      email: 'asc',
    },
    select: {
      email: true,
      role: true,
    },
  })

  if (users.length !== DEMO_USERS.length) {
    throw new Error(`Demo user seed verification failed. Expected ${DEMO_USERS.length} users, found ${users.length}.`)
  }

  logger.info('Demo users are ready', {
    existing: existingEmails,
    inserted: seededEmails,
    users,
  })
}

async function runSeed() {
  try {
    await prisma.$connect()
    await seedDemoUsers()

    const users = await prisma.user.findMany({
      where: {
        email: {
          in: DEMO_USERS.map((demoUser) => demoUser.email),
        },
      },
      orderBy: {
        email: 'asc',
      },
      select: {
        email: true,
        role: true,
      },
    })

    console.info('Demo user seed completed successfully.')
    console.table(users)
    process.exitCode = 0
  } catch (error) {
    console.error('Demo user seed failed with Prisma error:')
    console.error(error)
    process.exitCode = 1
  } finally {
    await prisma.$disconnect()
  }
}

const isDirectSeedRun = process.argv[1] === fileURLToPath(import.meta.url)

if (isDirectSeedRun) {
  void runSeed()
}
