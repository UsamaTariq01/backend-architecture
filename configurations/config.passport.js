const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt'),
    models = require('./config.sequelize').models,
    { Op } = require('sequelize');

passport.use('user', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (username, password, done) => {

    try {

        const user = await models.users.findOne({
            where: {
                email: username
            }
        });

        if (!user || !user.password) {

            return done(null, false, { msg: 110 });

        }

        if (!user.status || user.status !== 1) {

            return done(null, false, { msg: 111 });

        }


        const isMatch = await user.comparePassword(password);

        if (!isMatch) {

            return done(null, false, { msg: 112 });

        }

        return done(null, user);

    } catch (error) {

        return done(error); // Handle errors appropriately in your application

    }

}));




module.exports = passport;