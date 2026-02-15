const prisma = require('../../config/prisma')
const generateToken = require('../../utils/jwt')
const { hashPassword, comparePassword } = require('../../utils/hash')

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body

    try {
        const hashed = await hashPassword(password)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashed,
                role
            }
        })

        res.json(user)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await prisma.user.findUnique({ where: { email } })

        if (!user) return res.status(401).json({ message: 'Invalid credentials' })

        const match = await comparePassword(password, user.password)

        if (!match) return res.status(401).json({ message: 'Invalid credentials' })

        const token = generateToken(user)

        res.json({ token })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
