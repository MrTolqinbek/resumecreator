const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			default: 'My_portfolio',
		},
		about: String,
		source_url: String,
		visual_url: String,
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		image: {
			type: String,
			default: 'portfolioimg/default.jpeg',
		},
		tags: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Tag',
			},
		],
	},
	{
		timestamps: true,
	}
);

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
