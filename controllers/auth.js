const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = function(req, res, next){
	if(!req.headers.authorization || req.headers.authorization.split(' ').length <= 1)
		return res.status(401).json({
			type: "error",
			value: "ACCESS DENIED"
		});
	const token = req.headers.authorization.split(' ')[1];
	try{
		const verified = jwt.verify(token, config.secretKey);
		req.user = verified;
		next();
	} catch (err) {
		return res.status(400).json({
			type: "error",
			value: "Invalid Token."
		});
	}
}