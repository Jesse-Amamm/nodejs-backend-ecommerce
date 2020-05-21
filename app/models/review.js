const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ReviewSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true
    },
    description: { type: String, required: true },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      required: true
    },
    user_name: { type: String },
    rating: { type: Number },
    user_has_confirmed_purchase: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    timestamps: true
  }
);
ReviewSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Review", ReviewSchema);
