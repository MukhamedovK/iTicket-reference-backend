const Event = require("../models/eventModel");
const User = require("../models/authModel");
const { languageConverter } = require("../services/langConverter");
const areaModel = require("../models/areaModel");
const seatModel = require("../models/SeatModel");

const filterUsersByRole = async (req, res) => {
  const { role } = req.query;
  try {
    const usersByRole = await User.find({ role: role });
    res.status(200).json(usersByRole);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const filterEvents = async (req, res) => {
  try {
    let { categoryId, startDate, endDate, place, minPrice, maxPrice, lang } =
      req.query;
    let filter = {};

    if (categoryId) {
      filter.category = categoryId;
    }

    if (place) {
      const areas = await areaModel.find({ area: place }).select("_id");
      const areaIds = areas.map((area) => area._id);

      filter.area = { $in: areaIds };
    }

    if (startDate && endDate) {
      filter["date.date"] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (minPrice || maxPrice) {
      const seats = await seatModel
        .find({
          price: {
            ...(minPrice && { $gte: Number(minPrice) }),
            ...(maxPrice && { $lte: Number(maxPrice) }),
          },
        })
        .select("_id");

      const seatIds = seats.map((tc) => tc._id);

      const areas = await areaModel
        .find({ ticketCategory: { $in: seatIds } })
        .select("_id");
      const areaIds = areas.map((area) => area._id);

      if (filter.area) {
        filter.area.$in = [...new Set([...filter.area.$in, ...areaIds])];
      } else {
        filter.area = { $in: areaIds };
      }
    }

    const filteredEvents = await Event.find(filter).populate([
      { path: "category" },
      {
        path: "area",
        populate: {
          path: "ticketCategory",
        },
      },
    ]);

    let events = [];
    if (filteredEvents.length > 0) {
      events = filteredEvents.map((event) =>
        languageConverter(event.toObject(), lang)
      );
    }

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { filterEvents, filterUsersByRole };
