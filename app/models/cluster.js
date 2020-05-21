const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ClusterSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    zipcode: { type: String },
    rc_number: { type: String },
    mobile_number: {
      type: Array,
      required: true,
      validate: {
        validator: function(array) {
          return array.every(v => typeof v === "number");
        }
      }
    },
    email: {
      type: String,
      required: true,
      index: { unique: true },
      lowercase: true
    },
    cluster_code: { type: String, required: true },
    logo_url: { type: String },
    verified: { type: Boolean, default: false },
    verification_code: { type: String },
    company_name: { type: String },
    added_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true
    }
  },
  {
    timestamps: true,
    strict: false
  }
);

ClusterSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Cluster", ClusterSchema);
