const authController = require('../controllers/auth.controllers'),
    userValidator = require('../validators/users.validators'),
    userHelper = require('../controllers/helpers/users.helper');
// const passport = require('passport');

module.exports = (app, version) => {

    const moduleName = '/user/profile';
    app.post(
        `${version + moduleName}/signup`,
        userValidator.validateUserSignUp,
        userHelper.isPhoneNumberExists,
        userHelper.isEmailExists,
        authController.userSignUp

    );
    app.post(
        `${version + moduleName}/resend/code`,
        userValidator.validatePhoneNumber,
        userHelper.isPhoneNumberDoseNotExists,
        authController.resendUserPhoneNumberVerificationCode

    );
    app.post(
        `${version + moduleName}/verify/code`,
        userValidator.validatePhoneNumber,
        userValidator.validatephoneVerificationCode,
        userHelper.isPhoneNumberDoseNotExists,
        authController.phoneNumberVerification

    );
    app.post(
        `${version + moduleName}/password/setup`,
        userValidator.validatePhoneNumber,
        userValidator.validatePassword,
        userHelper.isPhoneNumberDoseNotExists,
        authController.passwordSetup

    );
    app.post(
        `${version + moduleName}/login`,
        userValidator.validateEmail,
        userHelper.isEmailExistsDoseNotExists,
        authController.userSignIn,
        authController.loginSuccessResponseUser

    );

};
