//THIS IS THE BACKEND
//Part of Model folder
//This is the the User model
//Defines the User object and also defines functions
//Get user by id and username function
//Add user and compare password function

const mongoose = require('mongoose');
const bcrypt =  require('bcryptjs');

//config gets all the functions in /config/database.js file
const config = require('../config/database');


//User Schema
const UserSchema = mongoose.Schema({

	name: {
		type: String
	},
	email: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}


});

//Passing the instance of a User object into db collection called users. Mongodb automatically appends an 's' to the end of user
const User = module.exports = mongoose.model('user', UserSchema);


//function to get user id
module.exports.getUserById = function(id, callback){

	User.findById(id, callback);
}


//function to find one username
module.exports.getUserByUsername= function(username, callback){

	const query = {username: username};
	User.findOne(query, callback);
}


//function to encrypt the password and save the new user
module.exports.addUser = function(newUser, callback){
  
  //bcrypt generates salt which is basically a random key generator
  bcrypt.genSalt(10, (err, salt) => {
  	//takes in the password and generates a random hash
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      
      if(err) throw err;

      //hash is the new encrypted password
      newUser.password = hash;

      //saving the new user w/ the encryted password
      newUser.save(callback);

    });

  });
}

//taking in candidate password, encrypted password and seeing if it matches
module.exports.comparePassword = function(candidatePassword, hash, callback){


	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {

    	if(err) throw err;

    	callback(null, isMatch);

  });
}