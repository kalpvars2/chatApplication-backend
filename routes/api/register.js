const express = require('express');
const validate = require('../../controllers/validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const User = require('../../models/userModel');

router.post('/', async (req, res) => {
	const {error} = validate(req.body);
	if(error)
		return res.status(400).json({
			type: "error",
			value: error.details[0].message
		});
	try{
		let user = await User.findOne({email: req.body.email});
		if(user)
			return res.status(400).json({
			type: "error",
			value: "User already exists."
		});
		user = new User({
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password)
		});
		await user.save();
		const payload = {
			email: user.email
		}
		const token = jwt.sign(payload, process.env.TOKEN_SECRET, {expiresIn: '7 days'});
		res.header('auth-token', token).json({
			type: "token",
			value: token
		});
	} catch(err) {
		console.log(err);
		return res.status(500).json({
			type: "error",
			value: "Server error. Registration unsuccessful."
		});
	}
});

module.exports = router;