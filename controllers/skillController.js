const catchAsync = require('../utils/catchAsync');
const Skill = require('../models/skillModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
require('dotenv').config({ path: '../config.env' });

exports.create = catchAsync(async (req, res, next) => {
	const { name, about } = req.body;
	const skill = await Skill.create({ name, about, owner: req.user._id });
	res.status(201).json({
		status: 'success',
		statusCode: 201,
		data: { skill },
		message: 'tag created successfully',
	});
});
exports.getAll = catchAsync(async (req, res, next) => {
	const skills = await Skill.find({});
	res.status(201).json({
		status: 'success',
		statusCode: 200,
		data: { skills },
		message: 'all skills',
	});
});
exports.getMyAll = catchAsync(async (req, res, next) => {
	const skills = await Skill.find({ owner: req.user._id });
	res.status(201).json({
		status: 'success',
		statusCode: 200,
		data: { skills },
		message: 'all skills',
	});
});
exports.get = catchAsync(async (req, res, next) => {
	const skill = await Skill.findOne({
		_id: req.params.id,
		owner: req.user._id,
	});
	if (!skill) {
		throw new AppError('invalid id', 404);
	}
	res.status(201).json({
		status: 'success',
		statusCode: 200,
		data: { skill },
		message: 'tag',
	});
});
exports.update = catchAsync(async (req, res, next) => {
	const skill = await Skill.findOne({
		_id: req.params.id,
		owner: req.user._id,
	});
	if (!skill) {
		throw new AppError('invalid id', 404);
	}
	const { name, about } = req.body;
	if (name) {
		skill.name = name;
	}
	if (about) {
		skill.about = about;
	}
	await skill.save();
	res.status(203).json({
		status: 'success',
		statusCode: 203,
		data: { skill },
		message: 'skill updated successfully',
	});
});
exports.delete = catchAsync(async (req, res, next) => {
	const skill = await Skill.findOne({
		_id: req.params.id,
		owner: req.user._id,
	});

	if (!skill) {
		throw new AppError('invalid id', 404);
	}
	await Skill.deleteOne({ _id: skill._id });
	res.status(204).json({
		status: 'success',
		statusCode: 204,
		message: 'skill deleted successfully',
	});
});
