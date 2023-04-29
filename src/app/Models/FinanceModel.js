const mongoose = require("mongoose");

const financeSchema = new mongoose.Schema({
	type: {
		type: String,
		enum: ["entrie", "exit"],
		required: true,
	},
	studentId: {
		type: mongoose.Types.ObjectId,
		ref: "users",
		required: true,
	},
	courseId: {
		type: mongoose.Types.ObjectId,
		ref: "classrooms",
		required: true,
	},
	discount: {
		type: Number,
	},
	classId: {
		type: mongoose.Types.ObjectId,
		ref: "classes"
	},
	price: {
		type: Number,
	},
	classes_quantity: {
		type: Number,
	},
	amount_of_output: {
		type: Number,
	},
	justification_of_absence: {
		type: String,
		maxlength: 500,
	},
	status: {
		type: String,
		enum: ["open", "closed", "canceled"],
		default: "open"
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
});

const FinanceModel = mongoose.model("finance", financeSchema);

module.exports = FinanceModel;