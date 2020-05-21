const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const CardSchema = mongoose.Schema(
  {
    name: { type: String },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true
    },
    description: { type: String }
  },
  {
    timestamps: true
  }
);

CategorySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Card", CardSchema);
