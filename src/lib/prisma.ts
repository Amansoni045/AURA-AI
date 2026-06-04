import * as PrismaModule from "@prisma/client"

// Workaround for Prisma 7 pnpm type resolution while keeping type safety for usage
const { PrismaClient } = PrismaModule as any

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined
}

let adapter: any

const databaseUrl = process.env.DATABASE_URL || "file:./prisma/dev.db"

if (databaseUrl.startsWith("file:")) {
  // Use better-sqlite3 for local SQLite files
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3")
  adapter = new PrismaBetterSqlite3({ url: databaseUrl })
} else {
  // Use libsql for Turso or other remote SQLite
  const { PrismaLibSql } = require("@prisma/adapter-libsql")
  
  adapter = new PrismaLibSql({
    url: databaseUrl,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })
}

export const prisma = (globalForPrisma.prisma ?? new PrismaClient({ adapter })) as import("@prisma/client").PrismaClient

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export { PrismaClient, databaseUrl }
