const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

/* const bcrypt = require('bcrypt');
const saltRounds = 10; */

const app = express();
app.use(bodyParser.json());
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
	res.json(database.users);
});

app.post('/signin', (req, res)=> {
	/* bcrypt.compare(req.body.password, '$2b$10$T5oTYZQr9mBBxuZEG2I03O9uP695ZWMvP1AqlHpfaM4xyYDHYgE42', function(err, res) {
		console.log("first attempt", res);
	});
	bcrypt.compare('apple', '$2b$10$T5oTYZQr9mBBxuZEG2I03O9uP695ZWMvP1AqlHpfaM4xyYDHYgE42', function(err, res) {
		console.log("second attempt", res);
	}); */
	if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
		res.json(database.users[0]);
	} else {
		res.status(400).json("error logging in");
	}
});

app.post('/register', (req, res) => {
	let lastId = database.users[database.users.length-1].id;
	let { name, email, password } = req.body;
	let newUser = {
		id: lastId+1,
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date()
	}
	/* bcrypt.hash(password, saltRounds, function(err, hash) {
		console.log(hash);
	  }); */
	database.users.push(newUser);
	res.json(newUser);
});

app.get('/profile/:id', (req, res) => {
	let id = Number(req.params.id);
	let found = false;
	for(let i=0, j=database.users.length; i<j; i++){
		if(database.users[i].id === id){
			found = true;
			res.json(database.users[i]);
		} 
	}
	if(!found){
		res.status(404).send("User not found");
	}
});

app.put('/image', (req, res) => {
	let { id } = req.body;
	let found = false;
	for(let i=0, j=database.users.length; i<j; i++){
		if(database.users[i].id === id){
			found = true;
			database.users[i].entries += 1;
			res.json(database.users[i].entries);
		} 
	}
	if(!found){
		res.status(404).send("User not found");
	}
});

app.listen(3000, () => {
	console.log("Started server");
});