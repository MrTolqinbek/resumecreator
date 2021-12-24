const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please tell us your name!'],
		},
		about: String,
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
);

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
