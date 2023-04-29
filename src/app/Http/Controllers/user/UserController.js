const UserService = require("../../Services/user/UserService.js");

class UserController {

	async create(req, res) {
		try {
			const createUserDto = req.createuserdto;
      
			const data = await UserService.create(createUserDto);
  
			return res.status(201).json(data);
		} catch(e)
		{
			return res.status(e.code).json({error: e.message});
		}
	}

	async getMe(req, res) {
		try {
			const user = req.user;
      
			const data = await UserService.getMe(user);
  
			return res.status(200).json(data);
		} catch(e)
		{
			return res.status(e.code).json({error: e.message});
		}
	}

	async findByUsername(req, res) {
		try {
			const username = req.params.username;

			const data = await UserService.findByUsername(username);
  
			return res.status(200).json(data);
		} catch(e)
		{
			return res.status(e.code).json({error: e.message});
		}
	}

	async search(req, res) {
		try {
			const name = req.query.name;
			const username = req.query.username;
			const email = req.query.email;
			const account_id = req.query.account_id;
			const base_url = req.originalUrl;
			let skip = req.query.skip;
			let limit = req.query.limit;

			skip = Number(skip);
			limit = Number(limit);

			const data = await UserService.search({name, email, username, account_id}, {skip, limit, base_url});
  
			return res.status(200).json(data);
		} catch(e)
		{
			return res.status(e.code).json({error: e.message});
		}
	}

	async update(req, res) {
		try {
			const user = req.user;
			const updateUserDto = req.updateuserdto;

			const data = await UserService.update(user, updateUserDto);
  
			return res.status(204).json(data);
		} catch(e)
		{
			return res.status(e.code).json({error: e.message});
		}
	}

	async remove(req, res) {
		try {
			const user = req.user;
			const password = req.body.password;

			const data = await UserService.remove(user, password);
  
			return res.status(204).json(data);
		} catch(e)
		{
			return res.status(e.code).json({error: e.message});
		}
	}
}

module.exports = new UserController;