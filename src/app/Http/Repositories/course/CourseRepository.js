const CourseModel = require("../../../Models/CourseModel.js");

class CourseRepository {

	#model;
	constructor() {
		this.#model = CourseModel;
	}

	async create(userId, classroomId, createCourseDto) {
		return await this.#model.create({createdBy: userId, classroomId, ...createCourseDto});
	}

	async findByCourseId(course_id) {
		return await this.#model.findOne({ course_id, deletedAt: null });
	}

	async findAllCoursesByUserId(userId) {
		let pipeline = this.#defaultPipeline();
		pipeline[0]["$match"]["createdBy"] = userId;

		const results = await this.#model.aggregate(pipeline);

		return results;
	}

	async aggregateShowCourse(course_id) {
		let pipeline = this.#defaultPipeline();
		pipeline[0]["$match"]["course_id"] = course_id;

		const results = await this.#model.aggregate(pipeline);

		return results[0];
	}

	async search(searchOptions, {skip, limit}) {
		let pipeline = this.#defaultPipeline();
		const paginationAndProject = [
			{ $skip: skip },
			{ $limit: limit }, 
			{
				$project: {
					"createdBy._id": 0,
				}
			}
		];
 
		if (searchOptions.name)
			pipeline[0]["$match"]["$or"] = [{ name: { $regex: searchOptions.name, $options: "i" } }];

		if (searchOptions.course_id)
			pipeline[0]["$match"]["$or"] = [{ course_id: { $regex: searchOptions.course_id, $options: "i" } }];

		const results = await this.#model.aggregate([...pipeline, ...paginationAndProject]);

		return results;
	}

	async update(courseId, updateCourseDto) {
		return await this.#model.updateOne({ _id: courseId, deletedAt: null }, { ...updateCourseDto, updatedAt: new Date() });
	}

	async countingDocumentsByName(searchOptions) {
		if (searchOptions.name)
			return await this.#model.countDocuments({ $or: [{ name: { $regex: searchOptions.name, $options: "i" } }] });

		if (searchOptions.course_id)
			return await this.#model.countDocuments({ $or: [{ course_id: { $regex: searchOptions.course_id, $options: "i" } }] });
    
		return 0;
	}

	async remove(courseId) {
		return await this.#model.updateOne(
			{ _id: courseId, deletedAt: null }, 
			{ deletedAt: new Date(), updatedAt: new Date() }
		);
	}

	#defaultPipeline() {
		return [
			{
				$match: {
					deletedAt: null,
				}
			},
			{
				$lookup: {
					from: "users",
					localField: "createdBy",
					foreignField: "_id",
					pipeline: [
						{
							$project: {
								first_name: 0,
								last_name: 0,
								email: 0,
								permissions: 0,
								password: 0,
								deletedAt: 0,
								createdAt: 0,
								updatedAt: 0,
								__v: 0,
							},
						}
					],
					as: "createdBy",
				},
			},
			{ $unwind: "$createdBy" },
			{
				$project: {
					_id: 0,
					classroomId: 0,
					deletedAt: 0,
					createdAt: 0,
					updatedAt: 0,
					__v: 0
				}
			}
		];
	}
}

module.exports = new CourseRepository;