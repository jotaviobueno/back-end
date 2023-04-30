const FrequancyModel = require("../../../Models/FrequancyModel.js");

class FrequencyRepository {

	async create(createFrequencyDto) {
		return await FrequancyModel.create({...createFrequencyDto});
	}

	async frequencyCountingWithClassroom(classroomId) {
		return await FrequancyModel.countDocuments({classroomId});
	}
	async studentHasAlreadyTakenThisClass(findOptions) {
		return await FrequancyModel.findOne({...findOptions});
	}
}

module.exports = new FrequencyRepository;