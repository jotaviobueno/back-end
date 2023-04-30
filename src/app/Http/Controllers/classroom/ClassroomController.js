const ClassroomService = require("../../Services/classroom/ClassroomService.js");

class ClassroomController {

	async show(req, res) {
		try {
			const user = req.user;
			const classroom_id = req.params.classroom_id;

			const data = await ClassroomService.show(user, classroom_id);
  
			return res.status(200).json(data);
		} catch(e)
		{
			return res.status(e.code).json({error: e.message});
		}
	}

	async makeRelatore(req, res) {
		try {
			const user = req.user;
			const classroom_id = req.params.classroom_id;

			const data = await ClassroomService.makeRelatore(user, classroom_id);
  
			return res.status(200).json(data);
		} catch(e)
		{
			return res.status(e.code).json({error: e.message});
		}
	}

	async remove(req, res) {
		try {
			const user = req.user;
			const classroom_id = req.params.classroom_id;

			const data = await ClassroomService.remove(user, classroom_id);
  
			return res.status(200).json(data);
		} catch(e)
		{
			return res.status(e.code).json({error: e.message});
		}
	}
}

module.exports =  new ClassroomController;