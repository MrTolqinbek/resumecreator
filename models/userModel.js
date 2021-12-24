const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please tell us your name!'],
		},
		lastName: {
			type: String,
		},
		email: {
			type: String,
			required: [true, 'Please provide your email'],
			unique: true,
			lowercase: true,
			validate: [validator.default.isEmail, 'Please provide a valid email'],
		},
		photo: {
			type: String,
			default: 'userimg/default.jpeg',
		},
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user',
		},
		bio: {
			type: String,
		},
		little: {
			type: String,
		},
		
		github_link: String,
		likedin_link: String,
		facebook_link: String,
		youtube_link: String,
		telegram_link: String,
		password: {
			type: String,
			required: [true, 'Please provide a password'],
			minlength: 8,
			select: false,
		},
		passwordChangedAt: {
			type: Date,
			default: new Date(),
		},
		passwordResetToken: String,
		passwordResetExpires: Date,
		active: {
			type: Boolean,
			default: true,
			select: false,
		},
		activated: {
			type: Boolean,
			default: false,
			select: false,
		},
		activationToken: String,
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model('User', userSchema);

module.exports = User;
