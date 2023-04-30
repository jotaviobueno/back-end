const {Router} = require("express");

const classroomRoutes = Router();

// Controllers
const ClassroomController = require("../Http/Controllers/classroom/ClassroomController.js");

// Middlewares
const { validateSession } = require("../Middlewares/ValidateSession.js");

classroomRoutes.get("/show/:classroom_id", validateSession, ClassroomController.show);
classroomRoutes.get("/relatore/:classroom_id", validateSession, ClassroomController.makeRelatore);
classroomRoutes.delete("/:classroom_id", validateSession, ClassroomController.remove);

module.exports.classroomRoutes = classroomRoutes;