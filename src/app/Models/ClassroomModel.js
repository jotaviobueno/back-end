const mongoose = require("mongoose");
const {randomUUID} = require("node:crypto");

const classroomSchema = new mongoose.Schema({
	classroom_id: {
		type: String,
		default: function () {
			return randomUUID();
		},
	},
	classroom_url: {
		type: String,
		default: function () {
			return `/classroom/show/${this.classroom_id}`;
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

const ClassroomModel = mongoose.model("classroom", classroomSchema);

module.exports = ClassroomModel;