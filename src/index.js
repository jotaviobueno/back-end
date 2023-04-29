require("dotenv/config");
const connection = require("./database/mongodb/connection.js");
const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const config = require("./config/config.js");
const {router} = require("./app/Routes/Router.js");

const app = express();

const server = express();

connection();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(router);

server.listen(config.PORT, () => {
	console.log(`Server listening on port: ${config.PORT}`);
});


module.exports.handler = serverless(app);
