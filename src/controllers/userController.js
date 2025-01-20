const Auth = require("../models/authModel");

const getUsers = async (req, res) => {
  try {
    const users = await Auth.find(req.body);
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await Auth.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = await Auth.create(req.body);

    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updateUser = await Auth.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({ success: true, data: updateUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleteUser = await Auth.findByIdAndDelete(req.params.id);
    if (!deleteUser) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }

    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };
