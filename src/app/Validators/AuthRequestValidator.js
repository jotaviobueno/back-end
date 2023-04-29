const Joi = require("joi");

class AuthRequestValidator {
  
	async createSessionValidator(req, res, next) {
		const body = {
			email: req.body.email,
			password: req.body.password,
		};

		const schema = Joi.object({
			email: Joi.string().email().required(),
			password: Joi.string().required(),
		});

		const { error } = schema.validate(body);
	
		if (error) return res.status(400).json({message: error.details[0].message});
		
		req.createsessiondto = {
			...body, 
		};
		next();
	}
}

module.exports = new AuthRequestValidator;