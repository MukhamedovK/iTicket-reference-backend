const mongoose = require("mongoose");

const orderModel = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "auth", required: true },
  time: {
    startTime: { type: Date, default: () => new Date() },
    endTime: {
      type: Date,
      default: () => new Date(Date.now() + 15 * 60 * 1000),
    },
  },
  seats: [
    {
      eventTitle: { type: String, required: false },
      date: { type: Date, required: false },
      startTime: { type: Date, required: false },
      cardImage: { type: String, required: false },
      seat: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Seat",
      },
    },
  ],
  transactionId: { type: String, required: false },
  create_time: { type: String, required: false },
  create_time: { type: Number, required: false },
  perform_time: { type: Number },
  cancel_time: { type: Number },
  state: { type: Number, required: false },
  reason: { type: Number },
  amount: { type: Number, required: false },
  status: {
    type: String,
    enum: ["НЕ ОПЛАЧЕНО", "ВЫСТАВЛЕНО", "ОПЛАЧЕНО", "ОТМЕНЕНО"],
    default: "НЕ ОПЛАЧЕНО",
  },
  paymentType: {
    type: String,
    enum: ["Payme", "Click", "Uzum"],
  },
});

orderModel.pre("save", async function (next) {
  await this.populate("seats.seat");
  this.amount = this.seats.reduce((sum, s) => sum + (s.seat.price || 0), 0);
  next();
});

orderModel.post("save", function (doc) {
  const timeLeft = doc.time?.endTime - Date.now();

  if (timeLeft > 0) {
    setTimeout(async () => {
      const order = await mongoose.model("orders").findById(doc._id);
      if (order && order.status !== "ОПЛАЧЕНО") {
        await mongoose.model("orders").findByIdAndDelete(doc._id);
        console.log(`Заказ ${doc._id} удалён из-за истечения времени`);
      }
    }, timeLeft);
  }
});

module.exports = mongoose.model("orders", orderModel);
