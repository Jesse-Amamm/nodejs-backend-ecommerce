const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");
const CountrySchema = mongoose.Schema({
    name: {type: String, required: true},
     latitude: {type: Number},
     longitude: {type: Number}
}, {
    timestamps: true,
});
CountrySchema.pre('remove', function(next) {
    this.model('State').remove({ country_id: this._id }, next);
});
CountrySchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Country', CountrySchema);
