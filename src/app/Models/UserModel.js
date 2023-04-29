const mongoose = require("mongoose");
const {randomUUID} = require("node:crypto");

const userSchema = new mongoose.Schema({
	account_id: {
		type: String,
		default: function () {
			return randomUUID();
		},
	},
	first_name: {
		type: String,
		minlength: 2,
		maxlength: 100,
		required: true
	},
	last_name: {
		type: String,
		minlength: 2,
		maxlength: 100,
		required: true
	},
	username: {
		type: String,
		minlength: 2,
		unique: true,
		maxlength: 30,
		required: true
	},
	email: {
		address: {
			type: String,
			required: true,
			unique: true
		},
		verifiedAt: {
			type: Date,
			default: null
		}
	},
	profile_url: {
		type: String,
		default: function () {
			return `/user/show/${this.username}`;
		},
	},
	avatar_url: {
		type: String,
		default:
      "https://www.cmcaindia.org/wp-content/uploads/2015/11/default-profile-picture-gmail-2.png",
	},
	permissions: {
		type: [String],
		enum: ["user", "student", "course_owner", "admin"],
		default: ["user"]
	},
	password: {
		type: String,
		required: true
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

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;