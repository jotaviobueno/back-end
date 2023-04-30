const FrequancyModel = require("../../../Models/FrequancyModel.js");

class FrequencyRepository {

	#model;
	constructor() {
		this.#model = FrequancyModel;
	}

	async create(createFrequencyDto) {
		return await this.#model.create({...createFrequencyDto});
	}

	async frequencyCountingWithClassroom(classroomId) {
		return await this.#model.countDocuments({classroomId});
	}
	
	async studentHasAlreadyTakenThisClass(findOptions) {
		return await this.#model.findOne({...findOptions});
	}
}

module.exports = new FrequencyRepository;