const Joi = require("joi");

class ClassRequestValidator {
  
	async createClassValidator(req, res, next) {
		const body = {
			name: req.body.name,
			description: req.body.description,
			images_url: req.body.images_url
		};

		const schema = Joi.object({
			name: Joi.string().min(2).max(300).required(),
			description: Joi.string().min(2).max(2000).required(),
			images_url: Joi.array().items(Joi.string().uri()).min(1).max(5).required()
		});

		const { error } = schema.validate(body);
	
		if (error) return res.status(400).json({message: error.details[0].message});
		
		req.createclassdto = {
			...body, 
		};
		next();
	}

	async makeJustification(req, res, next) {
		const body = {
			context: req.body.context,
		};

		const schema = Joi.object({
			context: Joi.string().min(2).max(500).required(),
		});

		const { error } = schema.validate(body);
	
		if (error) return res.status(400).json({message: error.details[0].message});
		
		next();
	}
}

module.exports = new ClassRequestValidator;