const Adds = require("../models/addsModel");
const imageUrlCreator = require("../services/imageUrlCreator");
const deleteFile = require("../services/deleteFile");

const getAdds = async (req, res) => {
  try {
    const adds = await Adds.find();
    res.status(200).json({ success: true, data: adds });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getAdd = async (req, res) => {
  const { id } = req.params;
  try {
    const adds = await Adds.findById(id);

    if (!adds)
      return res.status(400).json({ success: false, message: "Add not found" });

    res.status(200).json({ success: true, data: adds });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const createAdd = async (req, res) => {
  const { link } = req.body;
  let image;
  try {
    const filename = req.files["image"] ? req.files["image"][0].filename : null;
    if (filename) image = imageUrlCreator(filename, "adds");
    if (!image || !link)
      return res
        .status(404)
        .json({ success: false, message: "image and link are required" });
    const newAdd = await Adds.create({ ...req.body, image });
    res.status(201).json({ success: true, data: newAdd });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateAdd = async (req, res) => {
  const { id } = req.params;
  const { link } = req.body;
  let image;
  try {
    const filename = req.files["image"] ? req.files["image"][0].filename : null;
    if (filename) image = imageUrlCreator(filename, "adds");
    if (!image || !link)
      return res
        .status(404)
        .json({ success: false, message: "image and link are required" });

    const updatedAdd = await Adds.findByIdAndUpdate(
      id,
      { ...req.body, image },
      {
        new: true,
      }
    );
    res.status(200).json({ success: true, data: updatedAdd });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteAdd = async (req, res) => {
  const { id } = req.params;
  try {
    const addToDelete = await Adds.findById(id);
    if (!addToDelete)
      return res.status(404).json({ success: false, message: "Add not found" });

    if (addToDelete.image) {
      deleteFile(addToDelete.image);
    }

    await Adds.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Add deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getAdds, getAdd, createAdd, updateAdd, deleteAdd };
