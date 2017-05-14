//THIS IS THE BACKEND
//Part of the config folder
//you can get the code on npmjs passport-jwt site
//Some code changes: get user by id function instead of find one and
//jwt_payload._doc._id to get actual payload
//This is to authenticate the user.

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/database');

module.exports = function(passport){


  let opts = {};

  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.secret;

  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {

    //changed getuserbyId and parameter to jwt_payload._doc._id
    User.getUserById(jwt_payload._doc._id, (err, user) => {
      
      if(err){

        return done(err, false);
      }

      if(user){

        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));
}