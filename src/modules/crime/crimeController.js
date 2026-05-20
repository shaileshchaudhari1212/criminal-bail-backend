const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

////////////////////////////////////////////////////////////
// CREATE CRIME
////////////////////////////////////////////////////////////
exports.createCrime = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        error: "Crime name is required"
      });
    }

    const crime = await prisma.crime.create({
      data: {
        name,
        description
      }
    });

    res.json({
      message: "Crime created",
      crime
    });
  } catch (err) {
    next(err);
  }
};

////////////////////////////////////////////////////////////
// GET ALL CRIMES (ADMIN VIEW → active + inactive)
////////////////////////////////////////////////////////////
exports.getCrimes = async (req, res, next) => {
  try {
    const crimes = await prisma.crime.findMany({
      orderBy: {
        createdAt: "desc"
      },
      include: {
        _count: {
          select: { criminals: true }
        }
      }
    });

    res.json(crimes);
  } catch (err) {
    next(err);
  }
};

////////////////////////////////////////////////////////////
// NEW — GET ACTIVE CRIMES (OFFICER / FORM USE)
////////////////////////////////////////////////////////////
exports.getActiveCrimes = async (req, res, next) => {
  try {
    const crimes = await prisma.crime.findMany({
      where: { isActive: true },
      orderBy: {
        name: "asc"
      }
    });

    res.json(crimes);
  } catch (err) {
    next(err);
  }
};

////////////////////////////////////////////////////////////
// NEW — GET CRIMES BY STATION (Station → Crime flow)
////////////////////////////////////////////////////////////
exports.getCrimesByStation = async (req, res, next) => {
  try {
    const { stationId } = req.params;

    const crimes = await prisma.crime.findMany({
      where: {
        isActive: true,
        criminals: {
          some: {
            stations: {
              some: { stationId }
            },
            archived: false
          }
        }
      },
      include: {
        _count: {
          select: { criminals: true }
        }
      },
      orderBy: {
        name: "asc"
      }
    });

    res.json(crimes);
  } catch (err) {
    next(err);
  }
};

////////////////////////////////////////////////////////////
// UPDATE CRIME
////////////////////////////////////////////////////////////
exports.updateCrime = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const crime = await prisma.crime.update({
      where: { id },
      data: {
        name,
        description,
        isActive
      }
    });

    res.json({
      message: "Crime updated",
      crime
    });
  } catch (err) {
    next(err);
  }
};

////////////////////////////////////////////////////////////
// DEACTIVATE CRIME (SOFT DELETE)
////////////////////////////////////////////////////////////
exports.deactivateCrime = async (req, res, next) => {
  try {
    const { id } = req.params;

    const crime = await prisma.crime.update({
      where: { id },
      data: {
        isActive: false
      }
    });

    res.json({
      message: "Crime deactivated",
      crime
    });
  } catch (err) {
    next(err);
  }
};
