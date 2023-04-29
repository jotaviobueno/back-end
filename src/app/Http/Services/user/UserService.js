const {conflict, unprocessableEntity, notFound, unauthorized} = require("../../../common/Errors/HandleHttpErrors.js");
const {profileMapper} = require("../../../common/Mappers/UserMapper.js");
const BcryptHelper = require( "../../../Helpers/BcryptHelper.js");

const PaginationService = require("../pagination/PaginationService.js");

const UserRepository = require("../../Repositories/user/UserRepository.js");
const CourseRepository = require("../../Repositories/course/CourseRepository.js");


class UserService {

	async create(createUserDto) {
		const emailAlreadyExist = await UserRepository.forceFindByEmail(createUserDto.email);

		if (emailAlreadyExist) conflict("username or email already exists");

		const usernameAlreadyExist = await UserRepository.forceFindByUsername(createUserDto.username);

		if (usernameAlreadyExist) conflict("username or email already exists");

		const user = await UserRepository.create(createUserDto);

		if (! user) unprocessableEntity("It was not possible to create a user");

		return profileMapper(user);
	}

	async getMe(user) {
		const courses = await CourseRepository.findAllCoursesByUserId(user._id);

		const profile = profileMapper(user);

		return {
			...profile,
			courses
		};
	}

	async findByUsername(username) {
		const userExists = await UserRepository.aggregateShowUser(username);

		if (! userExists) notFound("username not found");

		return userExists;
	}

	async search(searchOptions, options) {
		const total = await UserRepository.countingDocumentsByName(searchOptions);

		if (total === 0) notFound("no user with that name was found");

		const users = await UserRepository.search(searchOptions, options);

		const pagination = PaginationService.pagination(users, total, options);

		return {
			...pagination,
		};
	}

	async update(user, updateUserDto) {
		if (updateUserDto.username) {
			const usernameAlreadyExists = await UserRepository.forceFindByUsername(updateUserDto.username);

			updateUserDto.profile_url = `/user/show/${updateUserDto.username}`;

			if (usernameAlreadyExists) conflict("username already exist");
		}

		const update = await UserRepository.update(user._id, updateUserDto);

		if (update.modifiedCount != 1) unprocessableEntity("Unable to update, please try again");
	}

	async remove(user, password) {
		const passwordIsValid = await BcryptHelper.compare(password, user.password);

		if (!passwordIsValid) unauthorized("authorized");

		const remove = await UserRepository.remove(user._id);

		if (remove.modifiedCount != 1) unprocessableEntity("Unable to delete account, please try again");
	}
}

module.exports = new UserService;