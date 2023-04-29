function profileMapper(user) {
	return {
		account_id: user.account_id,
		first_name: user.first_name,
		last_name: user.last_name,
		username: user.username,
		email: user.email.address,
		avatar_url: user.avatar_url,
		profile_url:  user.profile_url,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
	};
}

function userMapper(user) {
	return {
		account_id: user.account_id,
		first_name: user.first_name,
		last_name: user.last_name,
		username: user.username,
		// cursos que ele criou
		avatar_url: user.avatar_url,
		profile_url:  user.profile_url,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
	};
}

module.exports = {
	profileMapper,
	userMapper
};