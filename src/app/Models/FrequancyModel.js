const mongoose = require("mongoose");

const FrequancySchema = new mongoose.Schema({
	studentId: {
		type: mongoose.Types.ObjectId,
		ref: "users",
		required: true,
	},
	classroomId: {
		type: mongoose.Types.ObjectId,
		ref: "classrooms",
		required: true,
	},
	classId: {
		type: mongoose.Types.ObjectId,
		ref: "classes",
		required: true,
	},
	status: {
		type: String,
		enum: ["present", "absence"],
		required: true,
	},
	createdAt: {
		type: Date,
		default: function () {
			return new Date();
		}
	},
});

const FrequancyModel = mongoose.model("frequancy", FrequancySchema);

module.exports = FrequancyModel;