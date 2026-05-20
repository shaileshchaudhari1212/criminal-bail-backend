const prisma = require("../../config/prisma");

////////////////////////////////////////////////////////////
// CREATE CRIMINAL
////////////////////////////////////////////////////////////
exports.createCriminal = async (req, res) => {
  try {
    const {
      name,
      age,
      address,
      description,
      riskLevel,
      stationIds,
      photoPath,
      crimes,
      ipcSections
    } = req.body;

    if (!name || !age || !address || !riskLevel) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }

    const finalPhoto = req.file?.path || photoPath;

    if (!finalPhoto) {
      return res.status(400).json({
        error: "Criminal photo required"
      });
    }

    const criminal = await prisma.criminal.create({
      data: {
        name,
        age: Number(age),
        address,
        description: description || "",
        riskLevel,
        photoPath: finalPhoto,
        crimes: crimes || [],
        ipcSections: ipcSections || [],

        stations: {
          create: (stationIds || []).map(id => ({
            station: { connect: { id } }
          }))
        }
      }
    });

    res.json(criminal);

  } catch (err) {
    console.error("CREATE CRIMINAL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

////////////////////////////////////////////////////////////
// LIST ALL CRIMINALS
////////////////////////////////////////////////////////////
exports.listCriminals = async (req, res) => {
  try {
    const criminals = await prisma.criminal.findMany({
      where: { archived: false },
      orderBy: { createdAt: "desc" }
    });

    res.json(criminals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

////////////////////////////////////////////////////////////
// GET CRIMINALS BY STATION (OFFICER USE)
////////////////////////////////////////////////////////////
exports.getCriminalsByStation = async (req, res) => {
  try {
    const { stationId } = req.params;

    if (!stationId) {
      return res.status(400).json({ error: "Station ID required" });
    }

    const criminals = await prisma.criminal.findMany({
      where: {
        archived: false,
        stations: {
          some: { stationId }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(criminals);

  } catch (err) {
    console.error("GET BY STATION ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

////////////////////////////////////////////////////////////
// GLOBAL SEARCH
////////////////////////////////////////////////////////////
exports.searchCriminals = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) return res.json([]);

    const criminals = await prisma.criminal.findMany({
      where: {
        archived: false,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { address: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          ...(isNaN(q) ? [] : [{ age: Number(q) }]),
          { crimes: { has: q } },
          { ipcSections: { has: q } }
        ]
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(criminals);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

////////////////////////////////////////////////////////////
// GET SINGLE
////////////////////////////////////////////////////////////
exports.getCriminal = async (req, res) => {
  try {
    const { id } = req.params;

    const criminal = await prisma.criminal.findUnique({
      where: { id }
    });

    if (!criminal) {
      return res.status(404).json({ error: "Criminal not found" });
    }

    res.json(criminal);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

////////////////////////////////////////////////////////////
// ARCHIVE (SOFT DELETE)
////////////////////////////////////////////////////////////
exports.archiveCriminal = async (req, res) => {
  try {
    const { id } = req.params;

    const criminal = await prisma.criminal.update({
      where: { id },
      data: { archived: true }
    });

    res.json(criminal);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
