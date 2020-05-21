const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const CategorySchema = mongoose.Schema(
  {
    name: { type: String },
    added_by: {
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

module.exports = mongoose.model("Category", CategorySchema);
