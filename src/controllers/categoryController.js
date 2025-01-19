const Category = require("../models/categoryModel");
const { languageConverter } = require("../services/langConverter");

const getCategories = async (req, res) => {
  const lang = req.query.lang;
  try {
    const categories = await Category.find();
    const localizedCategories = languageConverter(categories, lang)
    
    res.status(200).json({ success: true, data: localizedCategories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCategoryById = async (req, res) => {
  const lang = req.query.lang;
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
      .status(404)
      .json({ success: false, message: "Category not found" });
    }
    const localizedCategories = languageConverter(category, lang)
    
    res.status(200).json({ success: true, data: localizedCategories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
