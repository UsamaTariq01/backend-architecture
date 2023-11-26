const userController = require('../controllers/user.controllers'),
    userValidator = require('../validators/users.validators'),
    userHelper = require('../controllers/helpers/users.helper'),
    passport = require('passport');

module.exports = (app, version) => {

    const moduleName = '/user/profile';
    app.get(
        `${version + moduleName}`,
        passport.authenticate('jwt', { session: false }),
        userController.userProfileResponse

    );
    app.put(
        `${version + moduleName}/update`,
        passport.authenticate('jwt', { session: false }),
        userValidator.validateUpdateProfile,
        userController.updateUserProfile

    );

};
