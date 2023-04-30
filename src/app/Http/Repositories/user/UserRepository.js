const UserModel = require("../../../Models/UserModel.js");

class UserRepository {
  
	#model;
	constructor() {
		this.#model = UserModel;
	}

	async create(createUserDto) {
		return await this.#model.create({...createUserDto, email: { address: createUserDto.email }});
	}
 
	async forceFindByEmail(email) {
		return await this.#model.findOne({ "email.address": email });
	}

	async findByEmail(email) {
		return await this.#model.findOne({ "email.address": email, deletedAt: null });
	}

	async forceFindByUsername(username) {
		return await this.#model.findOne({username});
	}

	async findByUsername(username) {
		return await this.#model.findOne({ username, deletedAt: null });
	}

	async findByUserId(userId) {
		return await this.#model.findOne({_id: userId, deletedAt: null});
	}

	async findByAccountId(account_id) {
		return await this.#model.findOne({account_id, deletedAt: null});
	}

	async search(searchOptions, {skip, limit}) {
		let defaultSearchPipeline = this.#defaultSearchPipeline();
		const pagination = [
			{ $skip: skip },
			{ $limit: limit }
		];

		if (searchOptions.account_id)
			defaultSearchPipeline[0]["$match"]["$or"] = [{ account_id: { $regex: searchOptions.account_id, $options: "i" } }];

		if (searchOptions.username)
			defaultSearchPipeline[0]["$match"]["$or"] = [{ username: { $regex: searchOptions.username, $options: "i" } }];

		if (searchOptions.email) 
			defaultSearchPipeline[0]["$match"]["$or"] = [{ email: { $regex: searchOptions.email, $options: "i" } }];

		if (searchOptions.name) 
			defaultSearchPipeline[0]["$match"]["$or"] = [
				{ first_name: { $regex: searchOptions.name, $options: "i" } }, 
				{ last_name: { $regex: searchOptions.name, $options: "i" } }
			];

		return await this.#model.aggregate([...defaultSearchPipeline, ...pagination]);
	}

	async aggregateShowUser(username) {
		let pipeline = this.#defaultPipeline();
		pipeline[0]["$match"]["username"] = username;

		const project = [
			{
				$project: {
					"_id": 0,
					"email": 0,
					"permissions":0,
					"password": 0,
					"deletedAt": 0,
					"__v": 0,
				}
			}
		];

		const results = await this.#model.aggregate([...pipeline, ...project]);

		return results[0];
	}

	async countingDocumentsByName(searchOptions) {

		if (searchOptions.account_id)
			return await this.#model.countDocuments({ $or: [{ account_id: { $regex: searchOptions.account_id, $options: "i" } }]});

		if (searchOptions.username)
			return await this.#model.countDocuments({ $or: [{ username: { $regex: searchOptions.username, $options: "i" } }]});

		if (searchOptions.email) 
			return await this.#model.countDocuments({ $or: [{ email: { $regex: searchOptions.email, $options: "i" } }]});

		if (searchOptions.name) 
			return await this.#model.countDocuments({ $or: [
				{ first_name: { $regex: searchOptions.name, $options: "i" } }, 
				{ last_name: { $regex: searchOptions.name, $options: "i" } }] 
			});

		return 0;
	}

	async update(userId, updateUserDto) {
		return await this.#model.updateOne({ _id: userId, deletedAt: null }, { ...updateUserDto, updatedAt: new Date() });
	}

	async includePermission(userId, permission) {
		return await this.#model.updateOne({ _id: userId, deletedAt: null }, { $push: {permissions: permission}, updateAt: new Date() });
	}

	async remove(userId) {
		return await this.#model.updateOne(
			{_id: userId, deletedAt: null}, 
			{deletedAt: new Date(), updatedAt: new Date()}
		);
	}

	#defaultSearchPipeline() {
		return [
			{
				$match: {
					deletedAt: null,
				}
			},
			{
				$project:  {
					_id: 0,
					first_name: 0,
					last_name: 0,
					email: 0,
					permissions:0,
					password: 0,
					deletedAt: 0,
					createdAt: 0,
					updatedAt: 0,
					__v: 0
				}
			}
		];
	}

	#defaultPipeline() {
		return [
			{
				$match: {
					deletedAt: null
				}
			},
			{
				$lookup: {
					from: "courses",
					localField: "_id",
					foreignField: "createdBy",
					pipeline: [
						{
							$project: {
								_id: 0,
								classroomId: 0,
								createdBy: 0,
								deletedAt: 0,
								createdAt: 0,
								updatedAt: 0,
								__v: 0
							}
						}
					],
					as: "courses",
				},
			},
		];
	}
}

module.exports = new UserRepository;