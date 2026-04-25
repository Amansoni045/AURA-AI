import * as PrismaModule from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"

// Workaround for Prisma 7 pnpm type resolution while keeping type safety for usage
const { PrismaClient } = PrismaModule as any

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined
}

const adapter = new PrismaBetterSqlite3({ 
  url: "file:./prisma/dev.db" 
})

export const prisma = (globalForPrisma.prisma ?? new PrismaClient({ adapter })) as import("@prisma/client").PrismaClient

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export { PrismaClient }
