const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");
const ColorSchema = mongoose.Schema({
    name: {type: String, required: true},
    hexcode: {type: String, }
}, {
    timestamps: true,
});
ColorSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Color', ColorSchema);
