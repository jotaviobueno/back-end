const ClassRepository = require("../../Repositories/class/ClassRepository.js");
const FinanceRepository = require("../../Repositories/finance/FinanceRepository.js");
const ClassroomRepository = require("../../Repositories/classroom/ClassroomRepository.js");
const FrequencyRepository = require("../../Repositories/frequency/FrequencyRepository.js");
const CourseStudantRepository = require("../../Repositories/courseStudent/CourseStudentRepository.js");
const UserRepository = require("../../Repositories/user/UserRepository.js");
const CourseStudentRepository = require("../../Repositories/courseStudent/CourseStudentRepository.js");
const { notFound, unauthorized, unprocessableEntity, forbidden, badRequest } = require("../../../common/Errors/HandleHttpErrors.js");
const { classMapper } = require("../../../common/Mappers/ClassMapper.js");

class ClassService {
  
	async create(user, classroom_id, createClassDto) {
		const classroomExists = await ClassroomRepository.findClassroomAndCourse(classroom_id);

		if (! classroomExists) notFound("classroom not found");

		if (classroomExists.course.createdBy.toString() != user._id.toString()) 
			unauthorized("you cannot create classes in classrooms that you do not own");
    
		const classStoraged = await ClassRepository.create(classroomExists._id, user._id, createClassDto);

		return classMapper(classStoraged);
	}

	async makeClass(user, classroom_id, class_id) {
		const classroomAndCourse = await ClassroomRepository.findClassroomAndCourse(classroom_id);
		if (!classroomAndCourse) 
			notFound("Classroom not found");
  
		const _class = await ClassRepository.findByClassId(class_id);
		if (!_class) 
			notFound("Class not found");

		const studentAlreadyTookThisClass = 
    await FrequencyRepository.studentHasAlreadyTakenThisClass({
    	studentId: user._id, 
    	classroomId: classroomAndCourse._id, 
    	classId: _class._id, 
    });

		if (studentAlreadyTookThisClass) 
			unprocessableEntity("you already did this lesson and you were not present in class");

		const amount_of_output = await FinanceRepository.update(user._id);
		if (!amount_of_output)
			unprocessableEntity("Your credits for this course have run out");
  
		const classes_quantity = amount_of_output.classes_quantity;

		await FinanceRepository.exit({
			type: "exit", 
			studentId: user._id, 
			courseId: classroomAndCourse.course._id,
			amount_of_output: 1,
			classId: _class._id, 
			status: "closed" 
		});

		await FrequencyRepository.create({
			studentId: user._id, 
			classroomId: classroomAndCourse._id, 
			classId: _class._id, 
			status: "present"
		});
  
		if (classes_quantity - 1 === 0) 
			await FinanceRepository.updateStatus(amount_of_output._id, "closed");
	}
  
	async wasAbsent(user, classroom_id, class_id, student_id) {
		const classroomAndCourse = await ClassroomRepository.findClassroomAndCourse(classroom_id);

		if (!classroomAndCourse) 
			notFound("Classroom not found");

		const _class = await ClassRepository.findByClassId(class_id);
    
		if (!_class) 
			notFound("Class not found");
    
		if (classroomAndCourse.course.createdBy.toString() != user._id) 
			unauthorized("you do not own this course");
    
		const student = await UserRepository.findByAccountId(student_id);

		if (! student) notFound("student not found");

		const userInCourse = await CourseStudentRepository.findByStudentIdAndCourseId(student._id, classroomAndCourse.course._id);

		if (!userInCourse) 
			unauthorized("this student is not in this course");
      
		const amount_of_output = await FinanceRepository.update(student._id);

		if (!amount_of_output)
			unprocessableEntity("the student does not have enough credits to remove");
  
		const studentAlreadyTookThisClass = 
    await FrequencyRepository.studentHasAlreadyTakenThisClass({
    	studentId: student._id,
    	classroomId: classroomAndCourse._id, 
    	classId: _class._id, 
    });
		
		if (studentAlreadyTookThisClass)
			unprocessableEntity("user has already done the lesson or is already missing");

		await FinanceRepository.exit({
			type: "exit", 
			studentId: student._id, 
			courseId: classroomAndCourse.course._id,
			amount_of_output: 1,
			classId: _class._id, 
			status: "open" 
		});

		await FrequencyRepository.create({
			studentId: student._id, 
			classroomId: classroomAndCourse._id, 
			classId: _class._id, 
			status: "absence"
		});
	}

	async makeJustification(user, classroom_id, class_id, context) {
		const classroomAndCourse = await ClassroomRepository.findClassroomAndCourse(classroom_id);

		if (! classroomAndCourse) notFound("classroom not found");

		const userInCourse = await CourseStudantRepository.findByStudentIdAndCourseId(user._id, classroomAndCourse.course._id);

		if (! userInCourse) forbidden("you are not registered for this course");
    
		const _class = await ClassRepository.findByClassId(class_id);

		if (! _class)
			notFound("class not found");

		const studentAlreadyTookThisClass = await FrequencyRepository.studentHasAlreadyTakenThisClass({
			studentId: user._id,
			classroomId: classroomAndCourse._id, 
			classId: _class._id,
			status: "absence"
		});
      
		if (! studentAlreadyTookThisClass) unprocessableEntity("you didn't miss this class");
    
		const userAlreadyCreateThisJustification = 
    await FinanceRepository.userAlreadyCreatedJustification(user._id, classroomAndCourse.course._id, _class._id);

		if (userAlreadyCreateThisJustification) 
			badRequest("you already created a justification for this class");

		await FinanceRepository.exit({
			type: "entrie", 
			studentId: user._id, 
			courseId: classroomAndCourse.course._id, 
			classId: _class._id, 
			status: "open",
			classes_quantity: 1,
			justification_of_absence: context,
		});

		return {message: "justification, created"};
	}
}

module.exports = new ClassService;