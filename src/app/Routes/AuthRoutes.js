const {Router} = require("express");

const authRoutes = Router();

// Controllers
const AuthController = require("../Http/Controllers/auth/AuthController.js");

// Middlewares
const AuthRequestValidator = require("../Validators/AuthRequestValidator.js");

authRoutes.post("/login", AuthRequestValidator.createSessionValidator, AuthController.login);

module.exports.authRoutes = authRoutes;