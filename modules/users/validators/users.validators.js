const GlobalLib = require('../../utils'),
    Logger = require('../../../configurations/logger.winston'),
    { check, param } = require('express-validator');

const validateUserSignUp = async (req, res, next) => {

    try {

        await check('phoneNumber').notEmpty().trim().escape().isMobilePhone().withMessage(100).run(req);
        await check('email').notEmpty().trim().escape().isString().isEmail()
            .normalizeEmail({ all_lowercase: true })
            .withMessage(104).run(req);
        await check('name').notEmpty().trim().escape().isString().withMessage(105).run(req);
        return GlobalLib.ValidateResponse('Initial Registration', req, res, next);

    } catch (err) {

        Logger.error(err);
        return next({ code: 2 });

    }

};
const validatePhoneNumber = async (req, res, next) => {

    try {

        await check('phoneNumber').notEmpty().trim().escape().isMobilePhone().withMessage(100).run(req);
        return GlobalLib.ValidateResponse('resend', req, res, next);

    } catch (err) {

        Logger.error(err);
        return next({ code: 2 });

    }

};
const validateEmail = async (req, res, next) => {

    try {

        await check('email').notEmpty().trim().escape().isString().isEmail()
            .normalizeEmail({ all_lowercase: true })
            .withMessage(104).run(req);
        return GlobalLib.ValidateResponse('resend', req, res, next);

    } catch (err) {

        Logger.error(err);
        return next({ code: 2 });

    }

};
const validatephoneVerificationCode = async (req, res, next) => {

    try {

        await check('phoneVerificationCode').notEmpty().isString().trim().escape().withMessage(100).run(req);
        return GlobalLib.ValidateResponse('resend', req, res, next);

    } catch (err) {

        Logger.error(err);
        return next({ code: 2 });

    }

};
const validatePassword = async (req, res, next) => {

    try {

        await check('password').notEmpty().trim().escape()
            .isString()
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            })
            .withMessage(115)

            .withMessage(115).run(req);
        return GlobalLib.ValidateResponse('resend', req, res, next);

    } catch (err) {

        Logger.error(err);
        return next({ code: 2 });

    }

};
const validateUpdateProfile = async (req, res, next) => {

    try {

        await check('name').optional().trim().escape().isString().withMessage(105).run(req);
        await check('faceId').optional().trim().escape().isBoolean().withMessage(119).run(req);
        await check('biometric').optional().trim().escape().isBoolean().withMessage(120).run(req);
        await check('language').optional().trim().escape().isString().isIn(global.config.languagesAllowed)
            .withMessage(121).run(req);
        await check('profileImage').optional().trim().escape().isString().isURL().withMessage(122).run(req);
        await check('gender').optional().trim().escape().isString()
            .isIn(global.config.genders).withMessage(105).run(req);
        return GlobalLib.ValidateResponse('resend', req, res, next);

    } catch (err) {

        Logger.error(err);
        return next({ code: 2 });

    }

};

module.exports = {
    validateUserSignUp,
    validatePhoneNumber,
    validatephoneVerificationCode,
    validatePassword,
    validateEmail,
    validateUpdateProfile

};
