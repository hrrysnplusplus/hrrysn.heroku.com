//THIS IS THE BACKEND
//Part of the socialapp folder
//This is the main configuration file

//Bringing dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

//config gets all the functions and variables in /config/database.js file
const config = require('./config/database');


//connecting to database stored in config file
mongoose.connect(config.database);

//On connection
mongoose.connection.on('connected', ()=> {

	console.log('Connected to database ' + config.database);
})

//On database connection error
mongoose.connection.on('error', (err)=> {

	console.log('Database error:  ' + err);
})



//Initalize app variable to express framework
const app = express();

//Creating route of users
const users = require('./routes/users');


//Start Server
const port = process.env.PORT || 8080;



//Cors middleware
app.use(cors());


//Set static folder to hold Angular 2 stuff
app.use(express.static(path.join(__dirname, 'public')));

//Body-parser middleware. It allows you to get data from forms
app.use(bodyParser.json());


// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);



//This is saying we want to use /users for all of our user routes
app.use('/users', users);


//Index route to let user know its invalid
app.get('/', (req, res) =>{

	res.send('Invalid Endpoint');
});

//* means everything, any other routhe should go to index.hthml
app.get('*', (req, res) => {

	res.sendFile(path.join(__dirname, 'public/index.html'))
})




app.listen(port, ()=> {

	console.log('Server started on port ' + port);
});