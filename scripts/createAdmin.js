require('dotenv').config()

const prisma = require('../src/config/prisma')
const bcrypt = require('bcrypt')

async function main() {

  const password = await bcrypt.hash("admin123", 10)

  const admin = await prisma.user.create({
    data: {
      name: "System Admin",
      email: "admin@system.local",
      password: password,
      role: "ADMIN"
    }
  })

  console.log("ADMIN CREATED")
  console.log(admin)
}

main().finally(() => prisma.$disconnect())
