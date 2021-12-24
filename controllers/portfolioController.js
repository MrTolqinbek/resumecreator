const catchAsync = require('../utils/catchAsync');
const fs = require('fs/promises');
const path = require('path');
const Skill = require('../models/skillModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
require('dotenv').config({ path: '../config.env' });
const Portfolio = require('../models/portfolioModel');
const Tag = require('../models/tagModel');
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

exports.uploadPortfolioPhoto = upload.single('photo');

exports.resizePortfolioPhoto = catchAsync(async (req, res, next) => {
	if (!req.file) return next();

	req.file.filename = `portfolio-${req.user.id}-${Date.now()}.jpeg`;

	await sharp(req.file.buffer)
		.resize(1024, 840)
		.toFormat('jpeg')
		.jpeg({ quality: 90 })
		.toFile(`public/portfolioimg/${req.file.filename}`);

	next();
});
exports.updateImage = catchAsync(async (req, res, next) => {
	const portfolio = await Portfolio.findOne({
		_id: req.params.id,
		owner: req.user._id,
	});
	if (!portfolio) {
		throw new AppError('portfolio with this id doesnot exist');
	}
	if (portfolio.image) {
		await fs.unlink(path.join(path.resolve(), 'public', portfolio.image));
	}
	portfolio.image = `portfolioimg/${req.file.filename}`;

	await portfolio.save();
	res.status(200).json({
		message: 'success',
		data: portfolio,
	});
});
exports.create = catchAsync(async (req, res, next) => {
	const { name, about } = req.body;

	const portfolio = await Portfolio.create({
		name,
		about,
		tags: [],
		owner: req.user._id,
	});
	res.status(201).json({
		message: 'succesfully created portfolio',
		data: {
			portfolio,
		},
	});
});

exports.getMyAll = catchAsync(async (req, res, next) => {
	const portfolios = await Portfolio.find({
		owner: req.user._id,
	})
		.populate({
			path: 'owner',
			select: 'name',
		})
		.populate('tags');
	res.status(200).json({
		message: 'success',
		data: portfolios,
	});
});
exports.getAll = catchAsync(async (req, res, next) => {
	const portfolios = await Portfolio.find({})
		.populate({
			path: 'owner',
			select: 'name',
		})
		.populate('tags');
	res.status(200).json({
		message: 'success',
		data: portfolios,
	});
});


exports.addTag = catchAsync(async (req, res, next) => {
	const { tags } = req.body;
	const portfolio = await Portfolio.findOne({
		_id: req.params.id,
		owner: req.user._id,
	});
	if (!portfolio) {
		throw new AppError('portfolio with this id doesnot exist');
	}
	portfolio.tags = [...portfolio.tags, ...tags];
	await portfolio.save();
	res.status(200).json({
		message: 'success',
		data: portfolio,
	});
});
exports.updateInfo = catchAsync(async (req, res, next) => {
	const { name, about, source_url, visual_url } = req.body;
	const portfolio = await Portfolio.findOne({
		_id: req.params.id,
		owner: req.user._id,
	});
	if (!portfolio) {
		throw new AppError('portfolio with this id doesnot exist');
	}
	portfolio.name = name;
	portfolio.about = about;
	portfolio.source_url = source_url;
	portfolio.visual_url = visual_url;
	await portfolio.save();
	res.status(200).json({
		message: 'success',
		data: portfolio,
	});
});
exports.deleteTags = catchAsync(async (req, res, next) => {
	const { tags } = req.body;
	const portfolio = await Portfolio.findOne({
		_id: req.params.id,
		owner: req.user._id,
	});
	if (!portfolio) {
		throw new AppError('portfolio with this id doesnot exist');
	}
	portfolio.tags = portfolio.tags.filter((tag) => !tags.includes(tag));
	await portfolio.save();
	res.status(200).json({
		message: 'success',
		data: portfolio,
	});
});
exports.delete = catchAsync(async (req, res, next) => {
	const portfolio = await Portfolio.findOne({
		_id: req.params.id,
		owner: req.user._id,
	});
	if (!portfolio) {
		throw new AppError('portfolio with this id doesnot exist');
	}
	await Portfolio.findByIdAndDelete(portfolio._id);

	res.status(204).json({
		message: 'success',
		data: portfolio,
	});
});
