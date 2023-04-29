const mongoose = require("mongoose");

const courseStudentSchema = new mongoose.Schema({
	studentId: {
		type: mongoose.Types.ObjectId,
		ref: "users",
		required: true,
	},
	courseId: {
		type: mongoose.Types.ObjectId,
		ref: "courses",
		required: true,
	},
	classroomId: {
		type: mongoose.Types.ObjectId,
		ref: "classrooms",
		required: true,
	},
});

const CourseStudentModel = mongoose.model("courseStudent", courseStudentSchema);

module.exports = CourseStudentModel;