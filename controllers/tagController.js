const catchAsync = require('./../utils/catchAsync');
const Tag = require('../models/tagModel');
const AppError = require('../utils/appError');
require('dotenv').config({ path: '../config.env' });

exports.create = catchAsync(async (req, res, next) => {
	const { name, about } = req.body;
	const tag = await Tag.create({ name, about });
	res.status(201).json({
		status: 'success',
		statusCode: 201,
		data: { tag: tag },
		message: 'tag created successfully',
	});
});
exports.getAll = catchAsync(async (req, res, next) => {
	const tags = await Tag.find({});
	res.status(201).json({
		status: 'success',
		statusCode: 200,
		data: { tags: tags },
		message: 'all tags',
	});
});
exports.get = catchAsync(async (req, res, next) => {
	const tag = await Tag.find({ _id: req.params.id });
	if (!tag) {
		throw new AppError('invalid id', 404);
	}
	res.status(201).json({
		status: 'success',
		statusCode: 200,
		data: { tag: tag },
		message: 'tag',
	});
});
exports.update = catchAsync(async (req, res, next) => {
	const tag = await Tag.findById(req.params.id);
	if (!tag) {
		throw new AppError('invalid id', 404);
	}
	const { name, about } = req.body;
	if (name) {
		tag.name = name;
	}
	if (about) {
		tag.about = about;
	}
	await tag.save();
	res.status(203).json({
		status: 'success',
		statusCode: 201,
		data: { tag: tag },
		message: 'tag updated successfully',
	});
});
exports.delete = catchAsync(async (req, res, next) => {
	const tag = await Tag.findById(req.params.id);
	if (!tag) {
		throw new AppError('invalid id', 404);
	}
	await Tag.deleteOne({ _id: tag._id });
	res.status(204).json({
		status: 'success',
		statusCode: 204,
		message: 'tag deleted successfully',
	});
});
