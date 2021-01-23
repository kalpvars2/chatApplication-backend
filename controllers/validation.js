const Joi = require('@hapi/joi');

const Validation = (data) => {
	const schema = Joi.object({
		email: Joi.string()
			.email()
			.required(),
		password: Joi.string()
			.required()
			.min(8)
	});
	return schema.validate(data);
};

const messageValidation = (message) => {
	const schema = Joi.object({
		message: Joi.string()
			.required(),
		email: Joi.string()
			.required()
			.email()
	});
	return schema.validate(message);
};

module.exports = Validation;