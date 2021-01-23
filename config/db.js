const mongoose = require('mongoose');

const connectDB = async () => {
	try{
		await mongoose.connect(process.env.MONGODB_URI || process.env.DB_URL, {
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