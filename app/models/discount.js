const mongoose = require('mongoose');
const DiscountSchema = mongoose.Schema({
    name: {type: String, },
    added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true},
    description: {type: String, },
    value:{type:Number, requird: true},
}, {
    timestamps: true,
});

module.exports = mongoose.model('Discount', DiscountSchema);
