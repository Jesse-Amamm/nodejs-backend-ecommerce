const mongoose = require("mongoose");
const PaymentSchema = mongoose.Schema(
  {
    name: { type: String },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    cart_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: false
    },
    payment_reference: { type: String, required: true },
    completed: { type: Boolean, default: false },
    amount: { type: Number, required: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Payment", PaymentSchema);
