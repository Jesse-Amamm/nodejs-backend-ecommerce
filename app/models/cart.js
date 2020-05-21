const mongoose = require("mongoose");
const CartSchema = mongoose.Schema(
  {
    products: [
      {
        product_id: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product"
        },
        quantity: { type: Number, required: true }
      }
    ],
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true,
    strict: false
  }
);

module.exports = mongoose.model("Cart", CartSchema);
