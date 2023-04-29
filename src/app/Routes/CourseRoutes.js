const {Router} = require("express");

const courseRoutes = Router();

// Controllers
const CourseController = require("../Http/Controllers/course/CourseController.js");

// Middlewares
const CourseRequestValidator = require("../Validators/CourseRequestValidator.js");
const { validateSession } = require("../Middlewares/ValidateSession.js");
const { preparSkip, preparLimit } = require("../Middlewares/PreparPagination.js");

courseRoutes.post("/", validateSession, CourseRequestValidator.creationCourseValidator, CourseController.create);
courseRoutes.post("/join/:course_id", validateSession, CourseRequestValidator.joinCourseValidator, CourseController.joinInTheCourse);
courseRoutes.get("/show/:course_id", validateSession, CourseController.show);
courseRoutes.get("/", validateSession, preparSkip, preparLimit, CourseController.search);
courseRoutes.patch("/:course_id", validateSession, CourseRequestValidator.updateCourseValidator, CourseController.update);
courseRoutes.delete("/:course_id", validateSession, CourseController.remove);

module.exports.courseRoutes = courseRoutes;