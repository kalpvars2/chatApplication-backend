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

module.exports = Validation;