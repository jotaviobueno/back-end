const {Router} = require("express");
const {userRoutes} = require("./UserRoutes.js");

const router = Router();

router.use("/user", userRoutes);

module.exports.router = router;