const ClassModel = require("../../../Models/ClassModel.js");

class ClassRepository {

	#model;
	constructor() {
		this.#model = ClassModel;
	}

	async create(classroomId, userId, createClassDto,) {
		return await this.#model.create({...createClassDto, createdBy: userId, classroomId});
	}

	async findByClassId(class_id) {
		return await this.#model.findOne({class_id, deletedAt: null});
	}
}

module.exports = new ClassRepository;