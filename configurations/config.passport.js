const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    models = require('./config.sequelize').models,
    { Op } = require('sequelize');

passport.use('user', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (username, password, done) => {

    console.log('passport');
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

        console.log('user status');
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {

            return done(null, false, { msg: 112 });

        }

        console.log('compare');
        return done(null, user);

    } catch (error) {

        return done(error); // Handle errors appropriately in your application

    }

}));


passport.deserializeUser(async (sessionConstructor, done) => {

    let account = null;

    switch (sessionConstructor.userType) {

    case 'company': {

        account = await db.companyAccounts.findOne({
            where: {
                aid: sessionConstructor.userId
            },
            raw: true
        });

        if (parseInt(account.userType) != 1) {

            account = JSON.parse(JSON.stringify(account));
            account.userId = account.aid;
            account.aid = account.companyId;

        }
        break;

    }
    case 'sp': {

        account = await db.drivers.findOne({ where: { did: sessionConstructor.userId } });
        break;

    }
    case 'admin': {

        account = await db.adminAccounts.findOne({
            where: { aid: sessionConstructor.userId }
        });
        account = JSON.parse(JSON.stringify(account));
        account.userId = account.aid;
        break;

    }
    default: {

        return;

    }


    }

    if (sessionConstructor.userId) {

        if (account) {

            return done(null, account);

        }
        return done(null, null);

    }
    return done(null, null);

});

// passport middleware
passport.isAuthenticated = (req, res, next) => {

    if (req.isAuthenticated()) {

        return next();

    }
    return next({
        msgCode: 3
    });

};

// fleetMS custom Permission Authentication

passport.isAuthorizedFleet = (permission, module) => { //* module -> {equipment, vehicle, user, tracking, fuel, geofencing, vendor}*/

    return (req, res, next) => {

        let isAuthenticated = false;
        const user = req.user;
        if (!user) { return next({ msgCode: 3 }); }
        user[`${module}Permission`] >= permission && (isAuthenticated = true);
        if (isAuthenticated) { return next(); }

        return next({ msgCode: 4 });

    };

};

passport.isAuthenticatedAdmin = (req, res, next) => {

    if (req.isAuthenticated()) {

        if (req.user.adminRoleId && req.user.status === 1) {

            return next();

        }
        return next({
            msgCode: 4
        });

    }
    return next({
        msgCode: 3
    });

};

passport.companyRolesAuthorization = (userType, permission, permissionLevel) => {

    return (req, res, next) => {

        if (userType.includes(req.user.userType) && !userType.includes(2)) {

            return next();

        } else if (userType == 2) {

            if (req.user[permission] == permissionLevel) {

                return next();

            }

        }

        return next({
            msgCode: 4
        });

    };

};

passport.isAuthorized = userType => {

    return (req, res, next) => {

        if (userType.includes(parseInt(req.user.userType))) {

            return next();

        }
        return next({
            msgCode: 4
        });

    };

};

function SessionConstructor (userId, userType, details) {

    this.userId = userId;
    this.userType = userType;
    this.details = details;

}


module.exports = passport;