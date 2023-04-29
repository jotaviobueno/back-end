const CourseService = require("../../Services/course/CourseService.js");

class CourseController {

	async create(req, res) {
		try {
			const user = req.user;
			const createCourseDto = req.createcoursedto;

			const data = await CourseService.create(user, createCourseDto);

			return res.status(201).json(data);
		} catch(e) {
			return res.status(e.code).json({error: e.message});
		}
	}

	async joinInTheCourse(req, res) {
		try {
			const user = req.user;
			const course_id = req.params.course_id;
			const classes_quantity = req.body.classes_quantity;

			const data = await CourseService.joinInTheCourse(user, course_id, classes_quantity);

			return res.status(200).json(data);
		} catch(e) {
			return res.status(e.code).json({error: e.message});
		}
	}

	async show(req, res) {
		try {
			const course_id = req.params.course_id;

			const data = await CourseService.show(course_id);

			return res.status(200).json(data);
		} catch(e) {
			return res.status(e.code).json({error: e.message});
		}
	}

	async search(req, res) {
		try {
			const name = req.query.name;
			const course_id = req.query.course_id;
			const base_url = req.originalUrl;
			let skip = req.query.skip;
			let limit = req.query.limit;

			skip = Number(skip);
			limit = Number(limit);

			const data = await CourseService.search({name, course_id}, {skip, limit, base_url});

			return res.status(200).json(data);
		} catch(e) {
			return res.status(e.code).json({error: e.message});
		}
	}

	async update(req, res) {
		try {
			const user = req.user;
			const course_id = req.params.course_id;
			const updateCourseDto = req.updatecoursedto;

			const data = await CourseService.update(user, course_id, updateCourseDto);

			return res.status(204).json(data);
		} catch(e) {
			return res.status(e.code).json({error: e.message});
		}
	}

	async remove(req, res) {
		try {
			const user = req.user;
			const course_id = req.params.course_id;

			const data = await CourseService.remove(user, course_id);

			return res.status(204).json(data);
		} catch(e) {
			return res.status(e.code).json({error: e.message});
		}
	}
}

module.exports = new CourseController; 