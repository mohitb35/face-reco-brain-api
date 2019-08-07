const handleProfile = (req, res, knex) => {
	let id = Number(req.params.id);
	knex.select('*')
		.from('users')
		.where('id', id)
		.then(user => {
			if(user.length){
				res.json(user[0]);
			} else {
				res.status(404).send("User not found");
			}
		})
		.catch(err => res.status(400).send("Error getting user"));
}


module.exports = {
	handleProfile: handleProfile
};