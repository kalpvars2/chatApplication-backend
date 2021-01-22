const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../../models/userModel');
const jwt = require('jsonwebtoken');
const validate = require('../../controllers/validation');

const router = express.Router();

router.post('/', async (req, res) => {
	const {error} = validate(req.body);
	if(error)
		return res.status(400).json({
			type: "error",
			value: error.details[0].message
		});
	try{
		let user = await User.findOne({email: req.body.email});
		if(!user)
			return res.status(400).json({
			type: "error",
			value: "Email not registered."
		});
		const validPassword = bcrypt.compareSync(req.body.password, user.password);
		if(!validPassword)
			return res.status(400).json({
			type: "error",
			value: "Invalid password."
		});
		const payload = {
			email: user.email
		};
		const token = jwt.sign(payload, process.env.TOKEN_SECRET, {expiresIn: '7 days'});
		res.header('auth-token').json({
			type: "token",
			value: token
		});
	} catch (err){
		console.log(err);
		return res.status(400).json({
			type: "error",
			value: err
		});
	}
});

module.exports = router;