const mongoose = require('mongoose');

const Chat = new mongoose.Schema({
	docKey: {
		type: String,
		required: true,
	},
	receiverHasRead:{
		type: Boolean,
		required: true
	},
	messages: {
		type: Array,
		default: []
	},
	users: {
		type: Array,
		default: []
	}
});	

module.exports = mongoose.model('chats', Chat);