const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt'),
    models = require('./config.sequelize').models;


const jwtUserOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: global.config.jwtSetting.secret
};
const jwtAdminOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: global.config.jwtSetting.adminSecret
};

passport.use('user-email-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (username, password, done) => {

    return await userAuth('email', false, username, password, done);

}));
passport.use('user-phone-login', new LocalStrategy({
    usernameField: 'phoneNumber',
    passwordField: 'password'
}, async (username, password, done) => {

    return await userAuth('phoneNumber', false, username, password, done);


}));
passport.use('user-otp-login-email', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'otp'
}, async (username, password, done) => {

    return await userAuth('email', true, username, password, done);


}));
passport.use('user-otp-login-phoneNumber', new LocalStrategy({
    usernameField: 'phoneNumber',
    passwordField: 'otp'
}, async (username, password, done) => {

    return await userAuth('phoneNumber', true, username, password, done);


}));

passport.use('admin-email-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (username, password, done) => {

    try {

        const admin = await models.admins.findOne({
            where: {
                email: username
            }
        });

        if (!admin?.password) {

            return done(null, false, { msg: 110 });

        }

        if (!admin.status || admin.status !== 1) {

            return done(null, false, { msg: 111 });

        }

        const isMatch = await admin.comparePassword(password);

        if (!isMatch) {

            return done(null, false, { msg: 112 });

        }

        return done(null, admin);

    } catch (error) {

        console.log(error);
        return done(error);

    }


}));


passport.use('user', new JwtStrategy(jwtUserOptions, async (jwtPayload, done) => {

    try {

        const user = await models.users.findOne({
            where: {
                id: jwtPayload.id
            },
            raw: true
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

passport.use('admin', new JwtStrategy(jwtAdminOptions, async (jwtPayload, done) => {

    try {

        const user = await models.admins.findOne({
            where: {
                id: jwtPayload.id
            },
            raw: true
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

passport.isAuthenticated = (req, res, next) => {

    passport.authenticate(
        'jwt',
        {
            session: false
        }
    );
    return next();

};

module.exports = passport;

async function userAuth (method, isOtp, username, password, done) {

    try {

        const logInMethod = {
            phoneNumber: {
                phone: username
            },
            email: {
                email: username
            }
        };

        const user = await models.users.findOne({
            where: logInMethod[method]
        });

        if (!user?.password) {

            return done(null, false, { msg: 110 });

        }

        if (!user.status || user.status !== 1) {

            return done(null, false, { msg: 111 });

        }

        if (isOtp) {

            const isOtpMatch = user.loginOtp === password;

            if (!isOtpMatch) {

                return done(null, false, { msg: 112 });

            }

            return done(null, user);

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

}
