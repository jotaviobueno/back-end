function courseAndClassroomMapper(classroom, course) {
	return {
		course: {
			name: course.name,
			description:course.description,
			price: course.price,
			images_url: course.images_url,
			course_id: course.course_id,
			course_url: course.course_url,
			createdAt: course.createdAt,
			updatedAt: course.updatedAt,
		},
		classroom: {
			classroom_id: classroom.classroom_id,
			classroom_url: classroom.classroom_url
		}
	};
}

module.exports = {
	courseAndClassroomMapper,
};