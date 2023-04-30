const FinanceModel = require("../../../Models/FinanceModel.js");

class FinanceRepository {

	#model;
	constructor() {
		this.#model = FinanceModel;
	}

	async create(createEntry) {
		return await this.#model.create(
			{ ...createEntry }
		);
	}

	async update(studentId) {
		return await this.#model.findOneAndUpdate(
			{ studentId, type: "entrie", classes_quantity: { $gt: 0 } }, 
			{ $inc: { classes_quantity: -1 }, updatedAt: new Date() },
		);
	}

	async updateStatus(financeId, status) {
		return await this.#model.updateOne({ _id: financeId}, { status, updatedAt: new Date() });
	}

	async userAlreadyCreatedJustification(studentId, courseId, classId) {
		return await this.#model.findOne({studentId, courseId, classId});
	}

	async exit(createExit) {
		return await this.#model.create({
			...createExit
		});
	}
}

module.exports = new FinanceRepository;