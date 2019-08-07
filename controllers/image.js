const Clarifai = require('clarifai');
const config = require('../config');

const app = new Clarifai.App({
	apiKey: config.CLARIFAI_KEY
});

const callClarifaiApi = (req, res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then(data => {
			res.json(data);
		})
		.catch((err) => {
			console.log("Error", err);
			res.status(400).json({error:err.statusText});
		})
};

const handleImage = (req, res, knex) => {
	let { id } = req.body;
	knex('users')
		.where('id', '=', id)
		.returning('entries')
		.increment('entries', 1)
		.then(entries => {
			if(entries.length){
				res.json(entries[0]);
			} else {
				res.status(400).json("Invalid user");
			}
		})
		.catch(err => res.status(400).json("Could not increment entries"));
};

module.exports = {
	handleImage: handleImage,
	callClarifaiApi: callClarifaiApi
};