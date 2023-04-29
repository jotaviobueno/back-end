const Joi = require("joi");

class CourseRequestValidator {
  
	async creationCourseValidator(req, res, next) {
		const body = {
			name: req.body.name,
			description: req.body.description,
			price: req.body.price,
			images_url: req.body.images_url
		};

		const schema = Joi.object({
			name: Joi.string().min(2).max(150).required(),
			description: Joi.string().min(2).max(1500).required(),
			price: Joi.number().min(1).max(999999).required(),
			images_url: Joi.array().items(Joi.string().uri()).min(1).max(5).required()
		});

		const { error } = schema.validate(body);
	
		if (error) return res.status(400).json({message: error.details[0].message});
		
		req.createcoursedto = {
			...body, 
		};
		next();
	}

	joinCourseValidator(req, res, next) {
		const classes_quantity = req.body.classes_quantity;
	
		if (! classes_quantity ) return res.status(400).json({message: "classes_quantity its not sent"});
		
		const regex = /^\d+$/;

		if (! regex.test(classes_quantity))
			return res.status(400).json({error: "envie apenas numero"});

		req.body.classes_quantity = Number(req.body.classes_quantity);
		next();
	}

	async updateCourseValidator(req, res, next) {
		const body = {
			name: req.body.name,
			description: req.body.description,
			price: req.body.price,
			images_url: req.body.images_url
		};

		for (const prop in body) {
			if (! body[prop]) delete body[prop];
		}

		if (Object.keys(body).length === 0) return res.status(400).json({ error: "it is not possible to update something empty" }); 

		const schema = Joi.object({
			name: Joi.string().min(2).max(150).optional(),
			description: Joi.string().min(2).max(1500).optional(),
			price: Joi.number().min(1).max(999999).optional(),
			images_url: Joi.array().items(Joi.string().uri()).min(1).max(5).optional()
		});

		const { error } = schema.validate(body);
	
		if (error) return res.status(400).json({message: error.details[0].message});
		
		req.updatecoursedto = {
			...body, 
		};
		next();
	}
}

module.exports = new CourseRequestValidator;