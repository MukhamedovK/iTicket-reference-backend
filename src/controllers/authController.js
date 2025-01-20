require("dotenv").config();
const Auth = require("../models/authModel");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET_KEY || "your-secret-key";

const loginUser = async (req, res) => {
  const { email, phoneNumber, password } = req.body;

  try {
    if (!email && !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Email or phone number is required.",
      });
    }

    const validateValue = email || phoneNumber;
    const user = await Auth.findOne({
      $or: [{ email: validateValue }, { phoneNumber: validateValue }],
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      data: { user, accessToken },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;
    const existingUser = await Auth.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email or phone number already in use.",
      });
    }

    const newUser = await Auth.create(req.body);

    const accessToken = jwt.sign(
      { id: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      data: { ...newUser.toObject(), accessToken },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { loginUser, registerUser };
