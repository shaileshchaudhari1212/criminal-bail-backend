require('dotenv').config()

const prisma = require('../src/config/prisma')
const bcrypt = require('bcrypt')

async function main() {

  const password = await bcrypt.hash("123456", 10)

  const officer = await prisma.user.create({
    data: {
      name: "Test Officer",
      email: "officer@test.local",
      password: password,
      role: "OFFICER"
    }
  })

  console.log("OFFICER CREATED")
  console.log(officer)
}

main().finally(() => prisma.$disconnect())
