const mongoose = require("mongoose");
const config = require("../../config/config.js");

function connection() {
	try {
		mongoose.connect(config.MONGO_URI);

		console.log("Database connection established.");
	} catch(e) {
		console.log(e);
	}
}

module.exports = connection;