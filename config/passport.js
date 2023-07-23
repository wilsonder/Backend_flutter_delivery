const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const User = require('../models/user');
const Keys = require('./keys');


//configuracion del token para iniciar sesion

module.exports = (passport) => {

    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = Keys.secretOrKey;

    passport.use(new JwtStrategy(opts,(jwt_payload, done) => {

        User.findById(jwt_payload.id, (err, user) => {

            if (err) {
                return done(err, false);
            }

            if (user) {
                return done(null, user);
            }

            else {
                return done(null,false);
            }


        });
    

    }));



}
