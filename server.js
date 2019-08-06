const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex')({
	client: 'pg',
	connection: {
	  host : '127.0.0.1',
	  user : 'mohit3',
	  password : '',
	  database : 'frb'
	}
  });

const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.use(bodyParser.json());``
app.use(cors());

const database = {
	users: [
		{
			id: 1,
			name: 'mohit',
			email: 'mohit.b35@gmail.com',
			password: 'password123',
			entries: 0,
			joined: new Date()
		},
		{
			id: 2,
			name: 'hersh',
			email: 'hersh@gmail.com',
			password: 'password456',
			entries: 0,
			joined: new Date()
		}
	],
	login: [
		{
			id: 1,
			hash: '',
			email: 'mohit.b35@gmail.com'
		}
	]
}

app.get('/', (req, res)=> {
	// res.json(database.users);
	knex.select().from('users').then(data => {
		console.log(data);
	});
});

app.post('/signin', (req, res)=> {
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
});


app.post('/register', (req, res) => {
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
});

app.get('/profile/:id', (req, res) => {
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
});

app.put('/image', (req, res) => {
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
});

app.listen(3000, () => {
	console.log("Started server");
});