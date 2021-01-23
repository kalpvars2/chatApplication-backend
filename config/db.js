const mongoose = require('mongoose');
const config = require('./config');

const db = config.mongoURI;

const connectDB = async () => {
	try{
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: true,
		});
		console.log("DB Connected.");
	} catch (err) {
		console.log(err.message);
		process.exit(1);
	}
};

module.exports = connectDB;