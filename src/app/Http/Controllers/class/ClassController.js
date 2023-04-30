const ClassService = require("../../Services/class/ClassService.js");

class ClassController {

	async create(req, res) {
		try {
			const user = req.user;
			const classroom_id = req.params.classroom_id;
			const createClassDto = req.createclassdto;

			const data = await ClassService.create(user, classroom_id, createClassDto);
  
			return res.status(200).json(data);
		} catch(e)
		{
			return res.status(e.code).json({error: e.message});
		}
	}

	async wasAbsent(req, res) {
		try {
			const user = req.user;
			const classroom_id = req.params.classroom_id;
			const class_id = req.params.class_id;
			const student_id = req.params.student_id;

			const data = await ClassService.wasAbsent(user, classroom_id, class_id, student_id);
  
			return res.status(200).json(data);
		} catch(e)
		{
			return res.status(e.code).json({error: e.message});
		}
	}

	async makeClass(req, res) {
		try {
			const user = req.user;
			const classroom_id = req.params.classroom_id;
			const class_id = req.params.class_id;

			const data = await ClassService.makeClass(user, classroom_id, class_id);
  
			return res.status(200).json(data);
		} catch(e)
		{
			return res.status(e.code).json({error: e.message});
		}
	}

	async makeJustification(req, res) {
		try {
			const user = req.user;
			const classroom_id = req.params.classroom_id;
			const class_id = req.params.class_id;
			const context = req.body.context;

			const data = await ClassService.makeJustification(user, classroom_id, class_id, context);
  
			return res.status(200).json(data);
		} catch(e)
		{
			return res.status(e.code).json({error: e.message});
		}
	}
}

module.exports = new ClassController;