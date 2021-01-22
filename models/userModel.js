const mongoose = require('mongoose');

const User = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	socketId: {
		type: String,
		required: false,
		default: ''
	}
});

module.exports = mongoose.model('users', User);