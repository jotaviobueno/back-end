const {Router} = require("express");

const classRoutes = Router();

// Controllers
const ClassController = require("../Http/Controllers/class/ClassController.js");

// Middlewares
const { validateSession } = require("../Middlewares/ValidateSession.js");
const ClassRequestValidator = require("../Validators/ClassRequestValidator.js");

classRoutes.post("/:classroom_id", validateSession, ClassRequestValidator.createClassValidator, ClassController.create);
classRoutes.post("/:classroom_id/make-class/:class_id", validateSession, ClassController.makeClass);
classRoutes.post("/:classroom_id/student-not-present/class/:class_id/:student_id", validateSession, ClassController.wasAbsent);
classRoutes.post("/:classroom_id/make-justification/:class_id", validateSession, ClassController.makeJustification);


module.exports.classRoutes = classRoutes;