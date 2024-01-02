const userController = require('../controllers/user.controllers'),
    userValidator = require('../validators/users.validators'),
    userHelper = require('../controllers/helpers/users.helper'),
    fileUpload = require('../../../configurations/config.multer'),
    profileImage = fileUpload.upload(global.config.aws.s3.folders.profileImages),
    passport = require('passport');

module.exports = (app, version) => {

    const moduleName = '/user/profile';
    app.get(
        `${version + moduleName}`,
        passport.authenticate('user', { session: false }),
        userController.userProfileResponse

    );
    app.put(
        `${version + moduleName}/update`,
        passport.authenticate('user', { session: false }),
        userValidator.validateUpdateProfile,
        userController.updateUserProfile

    );
    app.put(
        `${version + moduleName}/change/password`,
        passport.authenticate('user', { session: false }),
        userValidator.validateNewOldPassword,
        userHelper.verifyEmailOrPhoneAndPassword,
        userController.changePassword

    );
    app.put(
        `${version + moduleName}/change/email`,
        passport.authenticate('user', { session: false }),
        userValidator.validateEmail,
        userHelper.isEmailExists,
        userController.changeEmail

    );
    app.post(
        `${version + moduleName}/image`,
        passport.authenticate('user', { session: false }),
        profileImage.array('profileImage', 1),
        fileUpload.uploadImageResponse

    );

};
