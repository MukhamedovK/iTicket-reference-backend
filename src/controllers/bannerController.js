const Banner = require("../models/bannerModel");
const deleteFile = require("../services/deleteFile");
const imageUrlCreator = require("../services/imageUrlCreator");

const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res
        .status(404)
        .json({ success: false, message: "Banner not found" });
    }
    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createBanner = async (req, res) => {
  const { link } = req.body;
  let image;
  try {
    const filename = req.files["image"] ? req.files["image"][0].filename : null;
    if (filename) image = imageUrlCreator(filename, "banners");

    if (!image || !link)
      return res
        .status(404)
        .json({ success: false, message: "image and link are required" });

    const newBanner = await Banner.create({ ...req.body, image });
    res.status(201).json({ success: true, data: newBanner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBanner = async (req, res) => {
  const { id } = req.params;
  const { link } = req.body;
  let image;
  try {
    const filename = req.files["image"] ? req.files["image"][0].filename : null;
    if (filename) image = imageUrlCreator(filename, "banners");
    if (!image || !link)
      return res
        .status(404)
        .json({ success: false, message: "image and link are required" });

    const updatedBanner = await Banner.findByIdAndUpdate(
      id,
      { ...req.body, image },
      {
        new: true,
      }
    );
    res.status(200).json({ success: true, data: updatedBanner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBanner = async (req, res) => {
  const { id } = req.params;
  try {
    const banner = await Banner.findById(id);
    if (!banner) {
      return res
        .status(404)
        .json({ success: false, message: "Banner not found" });
    }

    if (banner.image) deleteFile(banner.image);

    await Banner.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBanner,
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
};
