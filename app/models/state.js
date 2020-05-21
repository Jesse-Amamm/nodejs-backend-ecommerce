const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");
const StateSchema = mongoose.Schema({
    name: {type: String, required: true},
     country_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Countries', required: true},
     latitude: {type: Number},
     longitude: {type: Number}
}, {
    timestamps: true,
});
StateSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('State', StateSchema);
