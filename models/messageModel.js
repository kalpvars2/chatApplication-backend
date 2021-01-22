const mongoose = require('mongoose');

const Message = new mongoose.Schema({
	message: {
		type: String,
		required: true
	},
	sender: {
		type: String,
		required: true
	}, 
	receiver: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('message', Message);