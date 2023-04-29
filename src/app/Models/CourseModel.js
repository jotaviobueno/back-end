const mongoose = require("mongoose");
const {randomUUID} = require("node:crypto");

const courseSchema = new mongoose.Schema({
	course_id: {
		type: String,
		default: function () {
			return randomUUID();
		},
	},
	name: {
		type: String,
		minlength: 2,
		maxlength: 150,
		required: true
	},
	description: {
		type: String,
		minlength: 2,
		maxlength: 1500,
		required: true
	},
	price: {
		type: Number,
		required: true,
	},
	course_url: {
		type: String,
		default: function () {
			return `/course/show/${this.course_id}`;
		},
	},
	images_url: {
		type: [String],
		required: true,
		minlength: 1,
		maxlength: 9,
	},
	classroomId: {
		type: mongoose.Types.ObjectId,
		ref: "classrooms",
		required: true,
	},
	createdBy: {
		type: mongoose.Types.ObjectId,
		ref: "users",
		required: true,
	},
	createdAt: {
		type: Date,
		default: function () {
			return new Date();
		}
	},
	updatedAt: {
		type: Date,
		default: function () {
			return new Date();
		}
	},
	deletedAt: {
		type: Date,
		default: null
	}
});

const courseModel = mongoose.model("course", courseSchema);

module.exports = courseModel;