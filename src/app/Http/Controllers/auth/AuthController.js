const AuthService = require("../../Services/auth/AuthService.js");

class AuthController {

	async login(req, res) {
		try {
			const createSessionDto = req.createsessiondto;

			const data = await AuthService.login(createSessionDto);

			return res.status(200).json(data);
		} catch(e)
		{
			return res.status(e.code).json({error: e.message});
		}
	}
}

module.exports = new AuthController;