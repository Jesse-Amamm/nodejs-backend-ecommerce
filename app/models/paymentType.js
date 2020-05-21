const mongoose = require('mongoose');
const PaymentTypeSchema = mongoose.Schema({
    name: {type: String, required: true},
}, {
    timestamps: true,
});
module.exports = mongoose.model('PaymentType', PaymentTypeSchema);
