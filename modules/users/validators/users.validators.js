const GlobalLib = require('../../utils'),
    Logger = require('../../../configurations/logger.winston'),
    { check, param, body } = require('express-validator');

const validateUserSignUp = async (req, res, next) => {

    try {

        await body('phoneNumber').notEmpty().trim().escape().isMobilePhone().withMessage(100).run(req);
        await body('email').notEmpty().trim().escape().isString().isEmail()
            .normalizeEmail({ all_lowercase: true })
            .withMessage(104).run(req);
        await body('name').notEmpty().trim().escape().isString().withMessage(105).run(req);
        await body('countryId').notEmpty().trim().escape().isInt({ min: 1 }).withMessage(124).run(req);
        return GlobalLib.ValidateResponse('Initial Registration', req, res, next);

    } catch (err) {

        Logger.error(err);
        return next({ msg: 2, code: 500  });

    }

};
const validatePhoneNumber = async (req, res, next) => {

    try {

        await body('phoneNumber').notEmpty().trim().escape().isMobilePhone().withMessage(100).run(req);
        return GlobalLib.ValidateResponse('resend', req, res, next);

    } catch (err) {

        Logger.error(err);
        return next({ msg: 2, code: 500  });

    }

};
const validateEmail = async (req, res, next) => {

    try {

        await body('email').notEmpty().trim().escape().isString().isEmail()
            .normalizeEmail({ all_lowercase: true })
            .withMessage(104).run(req);
        return GlobalLib.ValidateResponse('resend', req, res, next);

    } catch (err) {

        Logger.error(err);
        return next({ msg: 2, code: 500  });

    }

};
const validatephoneVerificationCode = async (req, res, next) => {

    try {

        await check('phoneVerificationCode').notEmpty().isString().trim().escape().withMessage(100).run(req);
        return GlobalLib.ValidateResponse('resend', req, res, next);

    } catch (err) {

        Logger.error(err);
        return next({ msg: 2, code: 500  });

    }

};
const validatePassword = async (req, res, next) => {

    try {

        await body('password').notEmpty().trim().escape()
            .isString()
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            })
            .withMessage(115).run(req);
        return GlobalLib.ValidateResponse('resend', req, res, next);

    } catch (err) {

        Logger.error(err);
        return next({ msg: 2, code: 500  });

    }

};
const validateNewOldPassword = async (req, res, next) => {

    try {

        await body('newPassword').notEmpty().trim().escape()
            .isString()
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            })
            .withMessage(115).run(req);
        await body('oldPassword').notEmpty().isString().trim().escape().withMessage(123).run(req);
        return GlobalLib.ValidateResponse('resend', req, res, next);

    } catch (err) {

        Logger.error(err);
        return next({ msg: 2, code: 500  });

    }

};
const validateUpdateProfile = async (req, res, next) => {

    try {

        await body('name').optional().trim().escape().isString().withMessage(105).run(req);
        await body('faceId').optional().trim().escape().isBoolean().withMessage(119).run(req);
        await body('biometric').optional().trim().escape().isBoolean().withMessage(120).run(req);
        await body('language').optional().trim().escape().isString().isIn(global.config.allowedLanguagesArray)
            .withMessage(121).run(req);
        await body('profileImage').optional({ values: 'falsy' }).trim().escape().isString().isURL().withMessage(122).run(req);
        await body('gender').optional().trim().escape().isString()
            .isIn(global.config.genders).withMessage(105).run(req);
        return GlobalLib.ValidateResponse('resend', req, res, next);

    } catch (err) {

        Logger.error(err);
        return next({ msg: 2, code: 500  });

    }

};

module.exports = {
    validateUserSignUp,
    validatePhoneNumber,
    validatephoneVerificationCode,
    validatePassword,
    validateEmail,
    validateUpdateProfile,
    validateNewOldPassword

};
