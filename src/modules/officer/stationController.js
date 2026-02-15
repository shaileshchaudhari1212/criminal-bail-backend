const prisma = require('../../config/prisma')

exports.createStation = async (req, res) => {
    const { name } = req.body

    try {
        const station = await prisma.station.create({
            data: { name }
        })

        res.json(station)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.listStations = async (req, res) => {
    const stations = await prisma.station.findMany()
    res.json(stations)
}
