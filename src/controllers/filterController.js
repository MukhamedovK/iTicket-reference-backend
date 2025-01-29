const Event = require("../models/eventModel");
const User = require("../models/authModel");
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

const filterUsersByRole = async (req, res) => {
  const { role } = req.query;
  try {
    const usersByRole = await User.find({ role: role });
    res.status(200).json(usersByRole);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { filterEventByCategory, filterUsersByRole };
