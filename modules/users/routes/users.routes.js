const userController = require('../controllers/user.controllers'),
    authController = require('../controllers/auth.controllers'),
    userValidator = require('../validators/users.validators'),
    userHelper = require('../controllers/helpers/users.helper'),
    fileUpload = require('../../../configurations/config.multer'),
    profileImage = fileUpload.upload(global.config.aws.s3.folders.profileImages),
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
    app.put(
        `${version + moduleName}/change/password`,
        passport.authenticate('jwt', { session: false }),
        userValidator.validateNewOldPassword,
        userHelper.setupUserEmail,
        authController.userSignIn,
        userController.changePassword

    );
    app.post(
        `${version + moduleName}/image`,
        passport.authenticate('jwt', { session: false }),
        profileImage.array('profileImage', 1),
        fileUpload.uploadImageResponse

    );

};
