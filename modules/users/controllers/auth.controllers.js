const Response = require('../../../configurations/config.response'),
    models = require('../../../configurations/config.sequelize').models,
    moment = require('moment'),
    passport = require('../../../configurations/config.passport'),
    globalUtils = require('../../utils');

//* ***********************user signup ********************************************* */
const userSignUp = async (req, res, next) => {

    try {

        const { phoneNumber } = req.body;
        const phoneVerificationCode = globalUtils.generateRandomNumber();
        // Get the current time
        const currentTime = moment();
        await models.users.create({
            phone: phoneNumber,
            name: req.body.name,
            phoneVerificationCode,
            phoneVerificationDateTime: currentTime,
            email: req.body.email,
            countryId: req.body.countryId

        });

        if (global.config.env === 'development') {

            return Response.sendResponse(
                res,
                {
                    msg: 100,
                    data: {
                        verificationCode: phoneVerificationCode
                    },
                    lang: req.params.lang
                }
            );

        }
        // twilio account setup and sendgrid setup
        globalUtils.sendSMS({
            phoneNo: phoneNumber,
            message: `your OTP code is: ${phoneVerificationCode}`
        });
        return Response.sendResponse(
            res,
            {
                msg: 100,
                data: {},
                lang: req.params.lang
            }
        );


    } catch (err) {

        console.log(err);
        return next({ msg: 3067, code: 500 });

    }

};
//* **************** sign up resend verification code ********************* */
const resendUserPhoneNumberVerificationCode = async (req, res, next) => {

    try {

        const { phoneNumber } = req.body;
        const phoneVerificationCode = globalUtils.generateRandomNumber();
        const currentTime = moment();

        const user = await models.users.findOne({
            where: {
                phone: phoneNumber
            },
            raw: true
        });

        const minutesPassed = currentTime.diff(user.phoneVerificationDateTime, 'minutes');

        if ( minutesPassed < 1) {

            return next({ msg: 108, code: 400 });

        }
        await models.users.update({

            phoneVerificationCode,
            phoneVerificationDateTime: currentTime
        },
        {
            where: {
                phone: phoneNumber
            }
        });

        if (global.config.env === 'development') {

            return Response.sendResponse(
                res,
                {
                    msg: 100,
                    data: {
                        verificationCode: phoneVerificationCode
                    },
                    lang: req.params.lang
                }
            );

        }
        // twilio account setup and sendgrid setup
        globalUtils.sendSMS({
            phoneNo: phoneNumber,
            message: `your OTP code is: ${phoneVerificationCode}`
        });
        return Response.sendResponse(
            res,
            {
                msg: 100,
                data: {},
                lang: req.params.lang
            }
        );

    } catch (err) {

        console.log(err);
        return next({ msg: 3067, code: 500 });

    }

};
//* **************** sign up phone number  verification **************************** */
const phoneNumberVerification = async (req, res, next) => {

    try {

        const { phoneNumber, phoneVerificationCode } = req.body;

        const user = await models.users.findOne({
            where: {
                phone: phoneNumber,
                phoneVerificationCode
            },
            raw: true
        });
        if (!user) {

            return next({ msg: 109, code: 400 });

        }

        await models.users.update({

            isPhoneVerified: true
        },
        {
            where: {
                phone: phoneNumber
            }
        });

        return Response.sendResponse(
            res,
            {
                msg: 102,
                data: {},
                lang: req.params.lang
            }
        );

    } catch (err) {

        console.log(err);
        return next({ msg: 3067, code: 500 });

    }

};
//* **************** sign up password setup *********************************** */
const passwordSetup = async (req, res, next) => {

    try {

        const { phoneNumber, password } = req.body;

        const user = await models.users.findOne({
            where: {
                phone: phoneNumber
            },
            raw: true
        });

        if (!user) {

            return next({ msg: 109, code: 400 });

        }

        const token = globalUtils.signJwt({
            id: user.id,
            name: user.name,
            email: user.email
        });

        await models.users.update({

            isPhoneVerified: true,
            password,
            userSessionToken: token
        },
        {
            where: {
                phone: phoneNumber
            }
        });
        res.setHeader('Access-Control-Expose-Headers', 'Authorization');
        res.setHeader('Authorization', token);

        return Response.sendResponse(
            res,
            {
                msg: 103,
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    token: token

                },
                lang: req.params.lang
            }
        );

    } catch (err) {

        console.log(err);
        return next({ msg: 3067, code: 500 });

    }

};


//* ************************send login success response ************************/
const loginSuccessResponseUser = (req, res, next) => {

    try {

        return Response.sendResponse(
            res,
            {
                msg: 108,
                data: {
                    id: req.user.id,
                    name: req.user.fullName,
                    email: req.user.email,
                    token: req.token

                },
                lang: req.params.lang
            }
        );


    } catch (err) {

        console.log(err);
        return next({ msgCode: 4081, code: 500 });

    }

};

//* ****************** login: send LogIn PhoneNumber Otp ************************/
const sendLogInPhoneNumberOtp = async (req, res, next) => {

    try {

        const { phoneNumber } = req.body;
        const loginOtp = globalUtils.generateRandomNumber();
        const currentTime = moment();

        const user = await models.users.findOne({
            where: {
                phone: phoneNumber
            },
            raw: true
        });
        if (user.loginOtpDateTime) {

            const minutesPassed = currentTime.diff(user.loginOtpDateTime, 'minutes');
            if ( minutesPassed < 1) {

                return next({ msg: 108, code: 400 });

            }

        }

        await models.users.update({

            loginOtp,
            loginOtpDateTime: currentTime
        },
        {
            where: {
                phone: phoneNumber
            }
        });

        if (global.config.env === 'development') {

            return Response.sendResponse(
                res,
                {
                    msg: 109,
                    data: {
                        verificationCode: loginOtp
                    },
                    lang: req.params.lang
                }
            );

        }
        // twilio account setup and sendgrid setup
        globalUtils.sendSMS({
            phoneNo: phoneNumber,
            message: `your OTP code is: ${loginOtp}`
        });
        return Response.sendResponse(
            res,
            {
                msg: 109,
                data: {},
                lang: req.params.lang
            }
        );

    } catch (err) {

        console.log(err);
        return next({ msg: 3067, code: 400 });

    }

};
//* ************************** verify otp time ******************************** */
//  TODO: add function to verify otp time and discard old OTPs;
//* ******************** ***** user sign in by phone number ************************/
const userSignInPhoneNumber = (req, res, next) => {

    return userSignIn('user-phone-login', req, res, next);

};
//* ******************** ***** user sign in by otp number ************************/
const userSignInOtpPhoneNumber = (req, res, next) => {

    return userSignIn('user-otp-login-phoneNumber', req, res, next);

};
//* **************************user email sign-In *********************************/
const userEmailSignIn = (req, res, next) => {

    return userSignIn('user-email-login', req, res, next);

};
// * ********************Sign-In methods processing **************************/
function userSignIn (method, req, res, next) {

    return passport.authenticate(method, (err, user, info) => {

        if (err) {

            return next(err);

        }
        if (!user) {

            return next(info);

        }

        req.user = user;

        req.token = globalUtils.signJwt({
            id: user.id,
            name: user.name,
            email: user.email
        });

        models.users.update({

            userSessionToken: req.token
        },
        {
            where: {
                id: user.id
            }
        });

        res.setHeader('Access-Control-Expose-Headers', 'Authorization');
        res.setHeader('Authorization', req.token);

        return next();

    })(req, res, next);

}
module.exports = {
    userSignUp,
    resendUserPhoneNumberVerificationCode,
    phoneNumberVerification,
    passwordSetup,
    userEmailSignIn,
    loginSuccessResponseUser,
    sendLogInPhoneNumberOtp,
    userSignInPhoneNumber,
    // verifyOtpTime
    userSignInOtpPhoneNumber,
    userSignIn
};