const Joi = require("joi");
const BcryptHelper = require("../Helpers/BcryptHelper.js");

class UserRequestValidator {
  
	async creationUserValidator(req, res, next) {
		const body = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
		};

		const schema = Joi.object({
			first_name: Joi.string().min(2).max(100).required(),
			last_name: Joi.string().min(2).max(100).required(),
			username: Joi.string().min(2).max(30).required(),
			email: Joi.string().email().required(),
			password: Joi.string().min(6).max(64).required(),
		});

		const { error } = schema.validate(body);
	
		if (error) return res.status(400).json({message: error.details[0].message});
		
		req.createuserdto = {
			...body, 
			password: await BcryptHelper.encrypt(body.password)
		};
		next();
	}

	async updateUserValidator(req, res, next) {
		let body = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			username: req.body.username,
			password: req.body.password,
		};

		for (const prop in body) {
			if (! body[prop]) delete body[prop];
		}

		if (Object.keys(body).length === 0) return res.status(400).json({ error: "it is not possible to update something empty" }); 
		
		const schema = Joi.object({
			first_name: Joi.string().min(2).max(100),
			last_name: Joi.string().min(2).max(100),
			username: Joi.string().min(2).max(30),
			email: Joi.string().email(),
			password: Joi.string().min(6).max(64),
		});

		const { error } = schema.validate(body);
	
		if (error) return res.status(400).json({message: error.details[0].message});
		
		if (body.password) body.password = await BcryptHelper.encrypt(body.password);

		req.updateuserdto = {
			...body, 
		};
		next();
	}

	async deleteUserValidator(req, res, next) {
		const password = req.body.password;

		if (! password) return res.status(400).json({error: "password its not sent"});

		next();
	}
}

module.exports = new UserRequestValidator;