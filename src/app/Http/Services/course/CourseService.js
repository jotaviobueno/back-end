const CourseRepository = require("../../Repositories/course/CourseRepository.js");
const ClassroomRepository = require("../../Repositories/classroom/ClassroomRepository.js");
const UserRepository = require("../../Repositories/user/UserRepository.js");
const CourseStudentRepository = require("../../Repositories/courseStudent/CourseStudentRepository.js");
const { unprocessableEntity, notFound, forbidden } = require("../../../common/Errors/HandleHttpErrors.js");
const PaginationService = require("../pagination/PaginationService.js");
const FinanceRepository = require("../../Repositories/finance/FinanceRepository.js");
const {courseAndClassroomMapper} = require("../../../common/Mappers/CourseMapper.js");

class CourseService {

	async create(user, createCourseDto) {
		const classroom = await ClassroomRepository.create();

		if (! classroom) 
			unprocessableEntity("Unable to create course");

		const course = await CourseRepository.create(user._id, classroom._id, createCourseDto);

		if (! course && classroom) {
			await ClassroomRepository.remove(classroom._id);

			unprocessableEntity("Unable to create course");
		}

		if (! user.permissions.includes(("course_owner")))
			await UserRepository.includePermission(user._id, "course_owner");

		return courseAndClassroomMapper(classroom, course);
	} 

	async joinInTheCourse(user, course_id, classes_quantity) {
		const courseExists = await CourseRepository.findByCourseId(course_id);

		if (! courseExists) notFound("course not found");

		const {classroom_id, classroom_url} = await ClassroomRepository.findByclassroomId(courseExists.classroomId);


		if (courseExists.createdBy.toString() === user._id.toString()) 
			unprocessableEntity("you can't buy a course you created");

		const userAlreadyInCourse = await CourseStudentRepository.findByStudentIdAndCourseId(user._id, courseExists._id);

		if (userAlreadyInCourse) {
			await FinanceRepository.create({
				type: "entrie",
				studentId: user._id, 
				courseId: courseExists._id,
				classes_quantity,
				price: courseExists.price,
				status: "closed"
			});

			return {classroom_id, classroom_url};
		}

		if (! user.permissions.includes(("student")))
			await UserRepository.includePermission(user._id, "student");

		await CourseStudentRepository.create(user._id, courseExists._id, courseExists.classroomId);
		await FinanceRepository.create({
			type: "entrie",
			studentId: user._id, 
			courseId: courseExists._id,
			classes_quantity,
			price: courseExists.price,
			status: "closed"
		});

		return {classroom_id, classroom_url};
	}

	async show(course_id) {
		const course = await CourseRepository.aggregateShowCourse(course_id);

		if (! course) 
			notFound("course not found");

		delete course.createdBy._id;

		return course;
	}

	async search(searchOptions, options) {
		const total = await CourseRepository.countingDocumentsByName(searchOptions);

		if (total === 0) notFound("course not found");

		const courses = await CourseRepository.search(searchOptions, options);

		const pagination = PaginationService.pagination(courses, total, options);

		return {
			...pagination
		};
	}

	async update(user, course_id, updateCourseDto) {
		const course = await CourseRepository.findByCourseId(course_id);

		if (! course) notFound("course not found");

		if (user._id.toString() != course.createdBy.toString()) forbidden("you cannot update a course that is not yours");

		const update = await CourseRepository.update(course._id, updateCourseDto);

		if (update.modifiedCount != 1) unprocessableEntity("Unable to update, please try again");
	}

	async remove(user, course_id) {
		const course = await CourseRepository.findByCourseId(course_id);

		if (! course) notFound("course not found");

		if (user._id.toString() != course.createdBy.toString()) forbidden("you delete update a course that is not yours");

		const remove = await CourseRepository.remove(course._id);

		if (remove.modifiedCount != 1) unprocessableEntity("Unable to remove, please try again");
	}
}

module.exports = new CourseService;