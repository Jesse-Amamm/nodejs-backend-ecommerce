const mongoose = require("mongoose");
const PictureSchema = mongoose.Schema(
  {
    url: { type: String, required: true },
    large_image_url: { type: String, required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model("Picture", PictureSchema);
