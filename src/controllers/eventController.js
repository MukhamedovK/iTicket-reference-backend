const Event = require("../models/eventModel");
const { languageConverter } = require("../services/langConverter");

const getEvents = async (req, res) => {
  const lang = req.query.lang;
  try {
    const events = await Event.find().populate("category", "name");
    const localizedEvents = events.map((event) =>
      languageConverter(event.toObject(), lang)
    );

    res.status(200).json({ success: true, data: localizedEvents });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getEvent = async (req, res) => {
  const lang = req.query.lang;
  try {
    const event = await Event.findById(req?.params?.id).populate(
      "category",
      "name"
    );
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }
    const localizedEvents = languageConverter(event.toObject(), lang);
    res.status(200).json({ success: true, data: localizedEvents });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    let { cardImage, bannerImage } = req.body;

    if (typeof cardImage !== "string" && typeof bannerImage !== "string") {
      cardImage = req.files["cardImage"]
        ? req.files["cardImage"].map((file) => file.path)
        : [];
      bannerImage = req.files["bannerImage"]
        ? req.files["bannerImage"][0].path
        : "";
    }
    const newEvent = await Event.create({
      ...req?.body,
      cardImage,
      bannerImage,
    });

    res.status(201).json({
      success: true,
      data: newEvent,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    let { cardImage, bannerImage } = req.body;

    if (typeof cardImage !== "string" && typeof bannerImage !== "string") {
      cardImage = req.files["cardImage"]
        ? req.files["cardImage"].map((file) => file.path)
        : [];
      bannerImage = req.files["bannerImage"]
        ? req.files["bannerImage"][0].path
        : "";
    }

    const event = await Event.findByIdAndUpdate(
      req?.params?.id,
      { ...req?.body, cardImage, bannerImage },
      {
        new: true,
      }
    );

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }
    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req?.params?.id);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getEvents, getEvent, createEvent, updateEvent, deleteEvent };
