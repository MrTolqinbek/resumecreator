const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const fs = require('fs/promises');
const path = require('path');
const AppError = require('../utils/appError');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '../config.env' });
const Portfolio = require('../models/portfolioModel');

const multer = require('multer');
const sharp = require('sharp');
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image')) {
		cb(null, true);
	} else {
		cb(new AppError('Not an image! Please upload only images.', 400), false);
	}
};

const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
	if (!req.file) return next();

	req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

	await sharp(req.file.buffer)
		.resize(500, 500)
		.toFormat('jpeg')
		.jpeg({ quality: 90 })
		.toFile(`public/userimg/${req.file.filename}`);

	next();
});
exports.updateImage = catchAsync(async (req, res, next) => {
	const user = await User.findOne({
		_id: req.user._id,
	});
	if (!user) {
		throw new AppError('user with this id doesnot exist');
	}

	if (user.photo == 'userimg/default.jpeg') {
		await fs.unlink(path.join(path.resolve(), 'public', user.photo));
	}
	user.photo = `userimg/${req.file.filename}`;

	await user.save();
	res.status(200).json({
		message: 'succesfully updated',
		data: {
			user,
		},
	});
});

exports.create = catchAsync(async (req, res, next) => {
	const portfolio = await Portfolio.create({ owner: req.user._id });
	res.status(201).json({
		message: 'succesfully created portfolio',
		data: {
			portfolio,
		},
	});
});
exports.getMe = catchAsync(async (req, res, next) => {
	// const user = await User.findById(req.user._id);
	const user = await User.aggregate([
		{ $match: { _id: req.user._id } },
		{
			$lookup: {
				from: 'skills',
				localField: '_id',
				foreignField: 'owner',
				as: 'skills',
			},
		},
	]);
	res.status(201).json({
		message: 'succesfully get you',
		data: {
			user,
		},
	});
});

exports.update = catchAsync(async (req, res, next) => {
	const {
		name,
		lastName,
		github_link,
		likedin_link,
		facebook_link,
		youtube_link,
		telegram_link,
		little,
		bio,
	} = req.body;
	const user = await User.findByIdAndUpdate(req.user._id, {
		name,
		lastName,
		github_link,
		likedin_link,
		facebook_link,
		youtube_link,
		telegram_link,
		little,
		bio,
	});
	user.password = undefined;
	res.status(201).json({
		message: 'succesfully updated info',
		data: {
			user,
		},
	});
});
exports.updateMe = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	const user = await User.findById(req.user._id);
	user.email = email;
	user.password = await bcrypt.hash(password, 12);
	user.passwordChangedAt = new Date();
	await user.save();
	user.password = undefined;
	res.status(201).json({
		message: 'succesfully updated info',
		data: {
			user,
		},
	});
});
