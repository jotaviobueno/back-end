const {Router} = require("express");

const userRoutes = Router();

const UserController = require("../Http/Controllers/user/UserController.js");

// Middlewares
const UserRequestValidator = require("../Validators/UserRequestValidator.js");
const {preparLimit, preparSkip} = require("../Middlewares/PreparPagination.js");
const {validateSession} = require("../Middlewares/ValidateSession.js");

userRoutes.post("/", UserRequestValidator.creationUserValidator, UserController.create);
userRoutes.get("/me", validateSession, UserController.getMe);
userRoutes.get("/show/:username", validateSession, UserController.findByUsername);
userRoutes.get("/", 
	validateSession, 
	preparLimit, 
	preparSkip,
	UserController.search
);
userRoutes.patch("/", 
	validateSession, 
	UserRequestValidator.updateUserValidator, 
	UserController.update
);
userRoutes.delete("/", 
	validateSession, 
	UserRequestValidator.deleteUserValidator, 
	UserController.remove
);


module.exports.userRoutes = userRoutes;