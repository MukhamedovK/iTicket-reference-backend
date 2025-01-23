const Event = require("../models/eventModel");
const { languageConverter } = require("../services/langConverter");

const filterEventByCategory = async (req, res) => {
  const { category, lang } = req.query;
  try {
    const events = await Event.find({ category: category }).populate(
      "category",
      "name"
    );

    let localizedEvents = [];
    if (events.length > 0) {
      localizedEvents = events.map((event) =>
        languageConverter(event.toObject(), lang)
      );
    }

    res.status(200).json({ success: true, data: localizedEvents });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { filterEventByCategory };
