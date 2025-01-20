const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const authModel = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  birthDate: { type: Date, required: false },
  gender: { type: String, required: false, enum: ["male", "female"] },
  country: { type: String, required: false },
  orders: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "orders",
      required: false,
    },
  ],
  address: {
    title: { type: String, required: false },
    street: { type: String, required: false },
    building: { type: String, required: false },
    apartment: { type: String, required: false },
    postalCode: { type: String, required: false },
    country: { type: String, required: false },
    city: { type: String, required: false },
    additionalInfo: { type: String, required: false },
  },
});

authModel.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("auth", authModel);
