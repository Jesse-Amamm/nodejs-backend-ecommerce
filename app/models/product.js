const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");
const ProductSchema = mongoose.Schema({
    name: {type: String, required: true},
    added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true},
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true},
    cluster_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Clusters',  },
    description: {type: String, required: true},
    price: {type: Number, required: true},
    qty: {type: Number, required: true},
    colors: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Colors', },],
    rating: {type: String},
    size:{type:Number},
    discount_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Discounts', },
}, {
    timestamps: true,
});
ProductSchema.pre('remove', function(next) {
    this.model('Picture').remove({ product_id: this._id }, next);
    this.model('Review').remove({ product_id: this._id }, next);
});
ProductSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Product', ProductSchema);
