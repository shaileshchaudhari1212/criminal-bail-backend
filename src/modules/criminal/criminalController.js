const prisma = require('../../config/prisma')

exports.createCriminal = async (req, res) => {
    const {
        name,
        age,
        address,
        description,
        riskLevel,
        photoPath,
        stationIds
    } = req.body

    try {
        const criminal = await prisma.criminal.create({
            data: {
                name,
                age,
                address,
                description,
                riskLevel,
                photoPath,
                stations: {
                    create: stationIds.map(id => ({
                        station: { connect: { id } }
                    }))
                }
            }
        })

        res.json(criminal)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.listCriminals = async (req, res) => {
    const criminals = await prisma.criminal.findMany({
        where: { archived: false },
        include: {
            stations: true
        }
    })

    res.json(criminals)
}

exports.getCriminal = async (req, res) => {
    const { id } = req.params

    const criminal = await prisma.criminal.findUnique({
        where: { id },
        include: {
            stations: true,
            attendances: true
        }
    })

    res.json(criminal)
}

exports.archiveCriminal = async (req, res) => {
    const { id } = req.params

    const criminal = await prisma.criminal.update({
        where: { id },
        data: { archived: true }
    })

    res.json(criminal)
}
