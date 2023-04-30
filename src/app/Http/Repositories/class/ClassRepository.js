const ClassModel = require("../../../Models/ClassModel.js");

class ClassRepository {

	async create(classroomId, userId, createClassDto,) {
		return await ClassModel.create({...createClassDto, createdBy: userId, classroomId});
	}

	async findByClassId(class_id) {
		return await ClassModel.findOne({class_id, deletedAt: null});
	}
}

module.exports = new ClassRepository;