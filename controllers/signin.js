const handleSignin = (req, res, knex, bcrypt) => {
	knex.select('hash', 'email').from('login')
		.where('email','=',req.body.email)
		.then(data => {
			if(data.length)
			{	
				let { hash, email } = data[0];
				bcrypt.compare(req.body.password, hash).then(function(result){
					if(result){
						return knex.select('*')
							.from('users')
							.where('email', '=', email)
							.then(user => {
								if(user.length){
									res.json(user[0]);
								} else {
									res.status(400).json("Error 1. Something went wrong");
								}
							});
					} else {
						res.status(400).json("Invalid credentials. Check your email and password.");
					}
				})
				.catch(err => res.status(400).json("Error 3. Something went wrong. Please try later"));
			} else {
				res.status(400).json("Invalid credentials. Check your email and password.");
			}
		})
		.catch(err => res.status(400).json("Error 4. Something went wrong. Please try later"));
};

module.exports = {
	handleSignin: handleSignin
};