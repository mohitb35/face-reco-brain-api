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

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const app = express();
app.use(bodyParser.json());
app.use(cors());

/* const database = {
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
} */

app.get('/', (req, res) => {
	knex.select().from('users').then(data => {
		res.send(data);
	}); 
});

app.post('/signin', (req, res) => { signin.handleSignin(req, res, knex, bcrypt) });

app.post('/register', (req, res) => {register.handleRegister(req, res, knex, bcrypt, saltRounds)});

app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, knex)});

app.put('/image', (req, res) => {image.handleImage(req, res, knex)}); 

app.post('/imageurl', (req, res) => {image.callClarifaiApi(req, res)});

app.listen(3000, () => {
	console.log("Started server");
});