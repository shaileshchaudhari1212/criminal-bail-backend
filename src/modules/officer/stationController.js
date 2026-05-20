const prisma = require("../../config/prisma");

////////////////////////////////////////////////////////////
// CREATE STATION
////////////////////////////////////////////////////////////
exports.createStation = async (req, res) => {
  try {
    const { name } = req.body;

    const station = await prisma.station.create({
      data: { name }
    });

    res.json(station);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

////////////////////////////////////////////////////////////
// LIST STATIONS
////////////////////////////////////////////////////////////
exports.listStations = async (req, res) => {
  try {
    const stations = await prisma.station.findMany();
    res.json(stations);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

////////////////////////////////////////////////////////////
// ⚠️ REMOVED OLD CRIME FLOW
// We no longer use Station → Crime → Criminal
// Criminals now store crimes directly
////////////////////////////////////////////////////////////

// DO NOT implement getCrimesByStation anymore
// DO NOT query prisma.crime
