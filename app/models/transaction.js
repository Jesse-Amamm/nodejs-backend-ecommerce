const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");
const TransactionSchema = mongoose.Schema({
     transaction_type: {type: String, },
     payment_type_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentTypes', required: true},
     description: {type:String},
     amount: {type: Number, required: true},
     order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Orders', required: true},
}, {
    timestamps: true,
});
TransactionSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Transaction', TransactionSchema);
