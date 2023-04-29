const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../../../../config/config.js");
const {unauthorized} = require("../../../common/Errors/HandleHttpErrors.js");
const BcryptHelper = require("../../../Helpers/BcryptHelper.js");
const UserRepository = require("../../Repositories/user/UserRepository.js");

class AuthService {

	async login(createSessionDto) {
		const emailExists = await UserRepository.findByEmail(createSessionDto.email);

		if (! emailExists) unauthorized("email or password are invalid");

		const passwordIsValid = await BcryptHelper.compare(createSessionDto.password, emailExists.password);

		if (! passwordIsValid) unauthorized("email or password are invalid");

		const payload = {
			sub: emailExists._id.toString(),
			permissions: emailExists.permissions
		};

		return { access_token: jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" }) };
	}
}

module.exports = new AuthService;