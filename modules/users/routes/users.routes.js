const userController = require('../controllers/user.controllers'),
    userValidator = require('../validators/users.validators'),
    userHelper = require('../controllers/helpers/users.helper'),
    passport = require('passport');
// const passport = require('passport');

module.exports = (app, version) => {

    const moduleName = '/user/profile';
    app.get(
        `${version + moduleName}`,
        // passport.isAuthenticated,
        passport.authenticate(
            'jwt',
            {
                session: false
            }
        ),
        userController.userProfileResponse

    );
    app.put(
        `${version + moduleName}/update`,
        userValidator.validateUserSignUp,
        userHelper.isPhoneNumberExists,
        userHelper.isEmailExists

    );

};
