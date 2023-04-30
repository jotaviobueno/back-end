const ClassroomRepository = require("../../Repositories/classroom/ClassroomRepository.js");
const FrequencyRepository = require("../../Repositories/frequency/FrequencyRepository.js");
const CourseStudentRepository = require("../../Repositories/courseStudent/CourseStudentRepository.js");
const { notFound, unauthorized, unprocessableEntity } = require("../../../common/Errors/HandleHttpErrors.js");

class ClassroomService {

	async show(user, classroom_id) {
		const classroom = await ClassroomRepository.retrieveClassroomDataByAggregation(classroom_id);
    
		if (!classroom) 
			notFound("Classroom not found");

		const isCourseOwner = classroom.course.createdBy.toString() === user._id.toString();
    
		if (user.permissions.includes("admin") || isCourseOwner)
			return classroom;
		
		const userInCourse = await CourseStudentRepository.findByStudentIdAndCourseId(user._id, classroom.course._id);
    
		if (!userInCourse) 
			unauthorized("You are not enrolled in this course");

		delete classroom.course._id;
		delete classroom.course.createdBy;
		
		return classroom;
	}

	async makeRelatore(user, classroom_id) {
		const data = await ClassroomRepository.makeRelatore(classroom_id);

		if (! data) notFound("classroom not found");

		return data;
	}

	async remove(user, classroom_id) {
		const classRoomAndCourse = await ClassroomRepository.findClassroomAndCourse(classroom_id);

		if (! classRoomAndCourse) notFound("classroom not found");

		const totalFrenquency = await FrequencyRepository.frequencyCountingWithClassroom(classRoomAndCourse._id);

		if (totalFrenquency != 0) 
			unprocessableEntity("não possivel deletar uma class que não esteja com frequencia 0");

		if (! user.permissions.includes("admin"))
			if (classRoomAndCourse.course.createdBy.toString() != user._id.toString()) 
				unauthorized("you are not allowed to delete a classroom");

		const remove = await ClassroomRepository.remove(classRoomAndCourse._id);

		if (remove.modifiedCount != 1) 
			unprocessableEntity("Unable to update, please try again");
	}
}

module.exports = new ClassroomService;