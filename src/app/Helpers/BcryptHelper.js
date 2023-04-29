const bcrypt = require("bcrypt");

class BcryptHelper {
	async encrypt(password, salt) {
		return await bcrypt.hash(password, salt ?? 6);
	}

	async compare(password, hash) {
		return await bcrypt.compare(password, hash);
	}
}

module.exports = new BcryptHelper;