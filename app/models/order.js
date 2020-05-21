const mongoose = require("mongoose");
const OrderSchema = mongoose.Schema(
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
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    }
  },
  {
    timestamps: true,
    strict: false
  }
);

module.exports = mongoose.model("Order", OrderSchema);
