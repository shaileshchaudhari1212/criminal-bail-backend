const prisma = require('../../config/prisma')
const { hashPassword } = require('../../utils/hash')

exports.createOfficer = async (req, res) => {
    const { name, email, password } = req.body

    try {
        const hashed = await hashPassword(password)

        const officer = await prisma.user.create({
            data: {
                name,
                email,
                password: hashed,
                role: 'OFFICER'
            }
        })

        res.json(officer)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.listOfficers = async (req, res) => {
    const officers = await prisma.user.findMany({
        where: { role: 'OFFICER' },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
        }
    })

    res.json(officers)
}
