const authController = require('../controllers/auth.controllers'),
    userValidator = require('../validators/users.validators'),
    userHelper = require('../controllers/helpers/users.helper');
// const passport = require('passport');

module.exports = (app, version) => {

    const moduleName = '/user/auth';
    //* ************************* sign up ***************************************** */
    app.post(
        `${version + moduleName}/signup`,
        userValidator.validateUserSignUp,
        userHelper.isPhoneNumberExists,
        userHelper.isEmailExists,
        userHelper.isCountryIdExists,
        authController.userSignUp

    );
    //* **************** sign up resend verification code ********************* */
    app.post(
        `${version + moduleName}/resend/code`,
        userValidator.validatePhoneNumber,
        userHelper.isPhoneNumberDoseNotExists,
        authController.resendUserPhoneNumberVerificationCode

    );
    //* ****************  sign up phone number  verification  **************************** */
    app.post(
        `${version + moduleName}/verify/code`,
        userValidator.validatePhoneNumber,
        userValidator.validatephoneVerificationCode,
        userHelper.isPhoneNumberDoseNotExists,
        authController.phoneNumberVerification

    );
    //* **************** sign up password setup ****************************** */
    app.post(
        `${version + moduleName}/password/setup`,
        userValidator.validatePhoneNumber,
        userValidator.validatePassword,
        userHelper.isPhoneNumberDoseNotExists,
        authController.passwordSetup

    );
    //* **************** logins ********************************************************* */
    //* **************** login: send email OTP ************************************************ */
    app.post(
        `${version + moduleName}/email/login`,
        userValidator.validateEmail,
        userHelper.isEmailExistsDoseNotExists,
        userHelper.isEmailVerified,
        authController.userEmailSignIn,
        authController.loginSuccessResponseUser

    );
    //* **************** login: send phone number OTP **************************************** */
    app.post(
        `${version + moduleName}/phone/login`,
        userValidator.validatePhoneNumber,
        userHelper.isPhoneNumberDoseNotExists,
        userHelper.isPhoneVerified,
        authController.userSignInPhoneNumber,
        authController.sendLogInPhoneNumberOtp

    );
    //* **************** login: phone number + otp login **************************************** */
    app.post(
        `${version + moduleName}/phone/login/otp`,
        userValidator.validatePhoneNumber,
        userHelper.isPhoneNumberDoseNotExists,
        authController.userSignInOtpPhoneNumber,
        authController.loginSuccessResponseUser

    );

};
