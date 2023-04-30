function classMapper(_class) {
	return {
		name: _class.name,
		description: _class.description,
		images_url: _class.images_url,
		class_id: _class.class_id,
		class_url: _class.class_url,
		createdAt: _class.createdAt,
		updatedAt: _class.updatedAt,
	};
}

module.exports = {
	classMapper,
};