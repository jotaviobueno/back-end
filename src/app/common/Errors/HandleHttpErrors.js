const {exception} = require("../Exceptions/Exception.js");

function badRequest(message) {
	handle(message, 400);
}

function unauthorized(message) {
	handle(message, 401);
}

function forbidden(message) {
	handle(message, 403);
}

function notFound(message) {
	handle(message, 404);
}

function notAcceptable(message) {
	handle(message, 406);
}

function conflict(message) {
	handle(message, 409);
}

function unprocessableEntity(message) {
	handle(message, 422);
}

function internalServerError(message) {
	handle(message, 500);
}

function handle(message, code) {
	throw new exception(message + ".", code);
}

module.exports = {
	badRequest,
	unauthorized,
	forbidden,
	notFound,
	notAcceptable,
	conflict,
	unprocessableEntity,
	internalServerError
};