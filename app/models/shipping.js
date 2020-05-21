const mongoose = require('mongoose');
const ShippingSchema = mongoose.Schema({
     title: {type: String, },
     vendor_name: {type: String, required: true},
     qty: {type: Number, required: true},
     total_price: {type: Number, required: true},
     payment_type_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentTypes', required: true},
     shipping_method_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ShippingMethods', required: true},
     description: {type:String},
     ships_from:  { type: mongoose.Schema.Types.ObjectId, ref: 'States', required: true},
     ships_to:  { type: mongoose.Schema.Types.ObjectId, ref: 'States', required: true},
}, {
    timestamps: true,
});
module.exports = mongoose.model('Shipping', ShippingSchema);
