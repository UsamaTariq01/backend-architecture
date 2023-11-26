const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt'),
    models = require('./config.sequelize').models;


const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: global.config.jwtSetting.secret
};
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

        console.log(error);
        return done(error);

    }

}));


passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {

    try {

        const user = await models.users.findOne({
            where: {
                id: jwtPayload.id
            }
        });

        if (!user || user.status !== 1) {

            // Handle invalid user or user status
            return done({ msg: 117 });

        }

        return done(null, user);

    } catch (error) {

        return done(error);

    }

}));

passport.isAuthenticated = async (req, res, next) => {

    passport.authenticate(
        'jwt',
        {
            session: false
        }
    );
    return next();

};

module.exports = passport;