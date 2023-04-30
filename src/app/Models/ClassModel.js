const mongoose = require("mongoose");
const {randomUUID} = require("node:crypto");

const classSchema = new mongoose.Schema({
	class_id: {
		type: String,
		default: function () {
			return randomUUID();
		},
	},
	name: {
		type: String,
		minlength: 2,
		maxlength: 300,
		required: true
	},
	description: {
		type: String,
		minlength: 2,
		maxlength: 2000,
		required: true
	},
	images_url: {
		type: [String],
		required: true,
		minlength: 1,
		maxlength: 5,
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
	class_url: {
		type: String,
		default: function () {
			return `/classroom/show/${this.classroomId.toString()}/class/${this.class_id}`;
		},
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

const ClassModel = mongoose.model("class", classSchema);

module.exports = ClassModel;