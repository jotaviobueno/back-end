const {Router} = require("express");
const {userRoutes} = require("./UserRoutes.js");
const {authRoutes} = require("./AuthRoutes.js");

const router = Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);

module.exports.router = router;