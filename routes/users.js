//THIS IS THE BACKEND
//Part of Routes folder
//Creates the routes and 
//www.socialapp.com/users/register
//www.socialapp.com/users/authenticate
//www.socialapp.com/users/profile


//Bringing in express and creating express router
const express = require('express');
const router = express.Router();

//Bring in passport
const passport = require('passport');
const jwt = require('jsonwebtoken');

//config gets all functions in directory, so we can use secret function
const config = require('../config/database');

//User gets all the functions in the /model/user.js file
const User = require('../models/user');


//Creating all the routes for User

//Register User Route should be post instead of get
router.post('/register', (req, res, next) => {

	let newUser = new User({

			name: req.body.name,
			email: req.body.email,
			username: req.body.username,
			password: req.body.password


		});

	//adding a new user 
	User.addUser(newUser, (err, user) => {

		//if else for user validation
		if(err){

      		res.json({success: false, msg:'Failed to register user'});
    
   		 } else {
      
      		res.json({success: true, msg:'User registered'});
    	}

	});
});


//Authenticate User Route using passport
//This works by authticating, getting a token, and using it for restricted routes
router.post('/authenticate', (req, res, next) => {
  
  //requesting username and password from the form	
  const username = req.body.username;
  const password = req.body.password;

  //check if a user exist and if user exist, creates a token to give access to other profile route
  User.getUserByUsername(username, (err, user) => {
    	
    	if(err) throw err;
    	
    	if(!user){
     		 return res.json({success: false, msg: 'User not found'});
    }

	   //if user exist, check if the password matches the user password
	   User.comparePassword(password, user.password, (err, isMatch) => {

	      	if(err) throw err;

	      	if(isMatch){

	      		//if the password matches, a token will be created and expires in 1 week
	      		//This token will be used to give access to a restricted route
	        	const token = jwt.sign(user, config.secret, {
	          	expiresIn: 604800 // 1 week
	        	
	        });

	        	//return success, token, and user info in login.component.ts
	        	res.json({
	          		success: true,

	          		token: 'JWT '+ token,

	          		user: {
	            	id: user._id,
	            	name: user.name,
	            	username: user.username,
	            	email: user.email
	          	}
	        	});
	      			 } else {

	      			 	//if password doesn't match
	        			return res.json({success: false, msg: 'Wrong password'});
	      				}	
    	});
  	});
});


//User Profile Route (protected)
//Any route you want to protect put passport.authencate as a second parameter
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  		

  		res.json({user: req.user});

});


module.exports = router;