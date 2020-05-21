const mongoose = require('mongoose');
const ShippingMethodSchema = mongoose.Schema({
     name: {type: String, },
     added_by:  { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true},
     min_day: {type: Number},
     max_day:{type:Number},
}, {
    timestamps: true,
});
module.exports = mongoose.model('ShippingMethod', ShippingMethodSchema);
