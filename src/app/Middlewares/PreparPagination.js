function preparSkip(req, res, next) {
	const skip = req.query.skip;

	if (skip) {
		if (Number.isFinite(skip)) {
			return res.status(400).json({ error: "skip cannot be a decimal number" });
		} else {
			next();
		}
	} else {
		req.query.skip = 0;
		next();
	}
}
  
function preparLimit(req, res, next) {
	const limit = req.query.limit;
  
	if (limit) {

		if (limit > 100 || limit < 1) 
			return res.status(400).json({error: "minimo do limite e 1"});

		next();
	} else {
		req.query.limit = 5;
		next();
	}
}

module.exports = {
	preparSkip,
	preparLimit,
};
