const ClassroomModel = require("../../../Models/ClassroomModel.js");

class ClassRoomRepository {

	async create() {
		return await ClassroomModel.create({});
	}

	async findByclassroomId(classroomId) {
		return await ClassroomModel.findOne({_id: classroomId});
	}

	async findClassroomAndCourse(classroom_id) {
		const pipeline = [
			{
				$match: {
					classroom_id,
					deletedAt: null
				}
			},
			{
				$lookup: {
					from: "courses",
					localField: "_id",
					foreignField: "classroomId",
					as: "course",
				},
			},
			{
				$unwind: "$course",
			}
		];

		const results = await ClassroomModel.aggregate(pipeline);

		return results[0];
	}

	async makeRelatore(classroom_id) {
		const pipeline = [
			{
				$match: {
					classroom_id,
				}
			},
			{
				$lookup: {
					from: "coursestudents",
					localField: "_id",
					foreignField: "classroomId",
					pipeline: [
						{
							$lookup: {
								from: "users",
								localField: "studentId",
								foreignField: "_id",
								pipeline: [
									{
										$lookup: {
											from: "finances",
											localField: "_id",
											foreignField: "studentId",
											pipeline: [
												{
													$addFields: {
														course_id: "$course_id"
													}
												},
												{
													$project: {
														_id: 0,
														studentId: 0,
														courseId: 0,
														__v: 0,
													},
												}
											],
											as: "finance",
										},
									},
									{
										$project: {
											_id: 0,
											first_name: 0,
											last_name: 0,
											email: 0,
											permissions: 0,
											password: 0,
											deletedAt: 0,
											createdAt: 0,
											updatedAt: 0,
											__v: 0
										}
									}
								],
								as: "student",
							},
						},
						{
							$project: {
								_id: 0,
								studentId: 0,
								courseId: 0,
								classroomId: 0,
								__v: 0,
							},
						},
						{ $unwind: "$student"}
					],
					as: "students",
				},
			},
			{
				$project: {
					__v: 0,
					deletedAt: 0,
					_id: 0,
				}
			}
		];

		const results = await ClassroomModel.aggregate(pipeline);

		return results[0];
	}
  
	async retrieveClassroomDataByAggregation(classroom_id) {
		let pipeline = this.#defaultPipeline();
		pipeline[0]["$match"]["classroom_id"] = classroom_id;

		const results = await ClassroomModel.aggregate(pipeline);

		return results[0];
	}

	async remove(classId) {
		return await ClassroomModel.updateOne({_id: classId, deletedAt: null}, {
			deletedAt: new Date(),
			updatedAt: new Date()
		});
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
					foreignField: "classroomId",
					pipeline: [
						{
							$project: {
								classroomId: 0,
								deletedAt: 0,
								createdAt: 0,
								updatedAt: 0,
								__v: 0,
							}
						}
					],
					as: "course",
				},
			},
			{
				$lookup: {
					from: "classes",
					localField: "_id",
					foreignField: "classroomId",
					pipeline: [
						{
							$project: {
								_id: 0,
								description: 0,
								classroomId: 0,
								createdBy: 0,
								deletedAt: 0,
								createdAt: 0,
								updatedAt: 0,
								__v: 0
							}
						}
					],
					as: "classes",
				},
			},
			{
				$unwind: "$course",
			},
			{
				$project: {
					_id: 0,
					deletedAt: 0,
					__v: 0,
				}
			}
		];
	}
}

module.exports = new ClassRoomRepository;