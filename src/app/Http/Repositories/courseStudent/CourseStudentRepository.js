const CourseStudentModel = require("../../../Models/CourseStudentModel.js");

class CourseStudentRepository {

	#model;
	constructor() {
		this.#model = CourseStudentModel;
	}

	async create(studentId, courseId, classroomId) {
		return await this.#model.create({studentId, courseId, classroomId});
	}

	async findByStudentIdAndCourseId(studentId, courseId) {
		return await this.#model.findOne({
			studentId,
			courseId
		});
	}
}

module.exports = new CourseStudentRepository;