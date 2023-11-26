const Response = require('../../../configurations/config.response'),
    models = require('../../../configurations/config.sequelize').models,
    moment = require('moment'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    passport = require('../../../configurations/config.passport'),
    globalUtils = require('../../utils');


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
            email: req.body.email

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
        return next({ msg: 3067 });

    }

};
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

            return next({ msg: 108 });

        }
        await models.users.update({

            phoneVerificationCode
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
        return next({ msg: 3067 });

    }

};
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

            return next({ msg: 109 });

        }

        await models.users.update({

            isPhoneVerified: true
        },
        {
            where: {
                phone: phoneNumber
            }
        });
        console.log(req.params.lang);
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
        return next({ msg: 3067 });

    }

};
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

            return next({ msg: 109 });

        }

        req.token = globalUtils.signJwt({
            id: user.id,
            name: user.name,
            email: user.email
        });

        await models.users.update({

            isPhoneVerified: true,
            password,
            userSessionToken: req.token
        },
        {
            where: {
                phone: phoneNumber
            }
        });
        res.setHeader('Access-Control-Expose-Headers', 'Authorization');
        res.setHeader('Authorization', req.token);

        return Response.sendResponse(
            res,
            {
                msg: 103,
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    token: req.token

                },
                lang: req.params.lang
            }
        );

    } catch (err) {

        console.log(err);
        return next({ msg: 3067 });

    }

};

const userSignIn = async (req, res, next) => {

    passport.authenticate('user', (err, user, info) => {

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

        res.setHeader('Access-Control-Expose-Headers', 'Authorization');
        res.setHeader('Authorization', req.token);

        return next();

    })(req, res, next);

};

const loginSuccessResponseUser = async (req, res, next) => {

    try {

        return Response.sendResponse(
            res,
            {
                msg: 103,
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
        return next({ msgCode: 4081 });

    }

};


module.exports = {
    userSignUp,
    resendUserPhoneNumberVerificationCode,
    phoneNumberVerification,
    passwordSetup,
    userSignIn,
    loginSuccessResponseUser
};