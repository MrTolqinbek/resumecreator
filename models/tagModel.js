const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Tag needs to have a name'],
			unique: true
		},
		about: String,
	},
	{
		timestamps: true,
	}
);

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
