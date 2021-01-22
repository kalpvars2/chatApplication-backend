const express = require('express');
const auth = require('../../controllers/auth');
const Chat = require('../../models/chatsModel');

const router = express.Router();

router.get('/', auth, async (req, res) => {
	try{
		const chats = await Chat.find({docKey: {'$regex' : '.*' + req.user.email + '.*'}});
		res.json({
			type: "data",
			value: {
				email: req.user.email,
				chats: chats
			}
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			type: "error",
			value: "Server error. Cannot retrieve chats."
		});
	}
});

module.exports = router;