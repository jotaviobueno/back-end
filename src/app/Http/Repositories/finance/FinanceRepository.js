const FinanceModel = require("../../../Models/FinanceModel.js");

class FinanceRepository {

	async create(createEntry) {
		return await FinanceModel.create(
			{ ...createEntry }
		);
	}

	async update(studentId) {
		return await FinanceModel.findOneAndUpdate(
			{ studentId, type: "entrie", status: "open", classes_quantity: { $gt: 0 } }, 
			{ $inc: { classes_quantity: -1 }, updatedAt: new Date() },
		);
	}

	async updateStatus(financeId, status) {
		return await FinanceModel.updateOne({ _id: financeId}, { status, updatedAt: new Date() });
	}

	async userAlreadyCreatedJustification(studentId, courseId, classId) {
		return await FinanceModel.findOne({studentId, courseId, classId});
	}

	async exit(createExit) {
		return await FinanceModel.create({
			...createExit
		});
	}
}

module.exports = new FinanceRepository;