const handleRegister = (req, res, knex, bcrypt, saltRounds) => {
	let { name, email, password } = req.body;
	bcrypt.hash(password, saltRounds, function(err, hash) {
		knex.transaction((trx) => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
					.returning('*')
					.insert({
						email: loginEmail[0],
						name: name,
						joined: new Date()
					})
					.then((user) => res.json(user[0]));
			})
			.then(trx.commit)
			.catch((err) => {
				trx.rollback;
				return res.status(400).json("Could not add user");
			})
		})
	})
};

module.exports = {
	handleRegister: handleRegister
};