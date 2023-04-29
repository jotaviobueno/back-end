const config = require("../../config/config.js");
const jwt = require("jsonwebtoken");
const UserRepository = require("../Http/Repositories/user/UserRepository.js");
const mongoose = require("mongoose");

async function validateSession(req, res, next) {
	const access_token = req.headers.authorization;

	if (! access_token) return res.status(422).json({error: "invalid session"});

	const token = access_token.split("Bearer ")[1];

	try {
		var decoded = jwt.verify(token, config.JWT_SECRET);

		const transformToObjectId = new mongoose.Types.ObjectId(decoded.sub);

		const user = await UserRepository.findByUserId(transformToObjectId);

		if (! user || user && user.deletedAt != null) return res.status(401).json({error: "Unauthorized"});

		req.user = user;
		next();

	} catch(err) {
		return res.status(401).json({error: "Unauthorized"});
	}
}

module.exports.validateSession = validateSession;