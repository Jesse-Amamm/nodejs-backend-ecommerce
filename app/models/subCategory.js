const mongoose = require('mongoose');
const SubCategorySchema = mongoose.Schema({
    name: {type: String, },
    added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true},
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories', required: true},
    description: {type: String, },
}, {
    timestamps: true,
});

module.exports = mongoose.model('SubCategory', SubCategorySchema);
