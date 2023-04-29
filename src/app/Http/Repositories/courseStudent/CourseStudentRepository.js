const CourseStudentModel = require("../../../Models/CourseStudentModel.js");

class CourseStudentRepository {

	async create(studentId, courseId, classroomId) {
		return await CourseStudentModel.create({studentId, courseId, classroomId});
	}

	async findByStudentIdAndCourseId(studentId, courseId) {
		return await CourseStudentModel.findOne({
			studentId,
			courseId
		});
	}
}

module.exports = new CourseStudentRepository;