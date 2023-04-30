require("dotenv/config");
const connection = require("./database/mongodb/connection.js");
const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const config = require("./config/config.js");

// POR PROBLEMAS TIVER QUE DEIXAR ASSIM
const {userRoutes} = require("./app/Routes/UserRoutes.js");
const {authRoutes} = require("./app/Routes/AuthRoutes.js");
const {courseRoutes} = require("./app/Routes/CourseRoutes.js");
const {classroomRoutes} = require("./app/Routes/ClassroomRoutes.js");
const {classRoutes} = require("./app/Routes/ClassRoutes.js");

const app = express();

const server = express();

connection();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));

app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/course", courseRoutes);
app.use("/classroom", classroomRoutes, classRoutes);

app.get("/", (req, res) => {
	return res.status(200).json({ message: "OK" });
});

server.listen(config.PORT, () => {
	console.log(`Server listening on port: ${config.PORT}`);
});

module.exports.handler = serverless(app);