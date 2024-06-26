const models = require('../../../../configurations/config.sequelize').models,
    logger = require('../../../../configurations/logger.winston'),
    authController = require('../auth.controllers');

const isPhoneNumberExists = async (req, res, next) => {

    try {

        const isPhoneNumberExists = await models.users.findOne({
            where: {
                phone: req.body.phoneNumber
            },
            raw: true
        });
        if (isPhoneNumberExists) {

            return next({ msg: 103, code: 400 });

        }

        return next();

    } catch (error) {

        logger.error(error);
        return next({ msg: 107, code: 500 });

    }

};
const isPhoneNumberDoseNotExists = async (req, res, next) => {

    try {

        const isPhoneNumberExists = await models.users.findOne({
            where: {
                phone: req.body.phoneNumber
            },
            raw: true
        });
        if (!isPhoneNumberExists) {

            return next({ msg: 113, code: 400 });

        }

        return next();

    } catch (error) {

        logger.error(error);
        return next({ msg: 107, code: 500 });

    }

};
const isPhoneVerified = async (req, res, next) => {

    try {

        const isPhoneNumberExistsAndVerified = await models.users.findOne({
            where: {
                phone: req.body.phoneNumber,
                isPhoneVerified: true
            },
            raw: true
        });
        if (!isPhoneNumberExistsAndVerified) {

            return next({ msg: 125, code: 400 });

        }
        return next();

    } catch (error) {

        logger.error(error);
        return next({ msg: 3067, code: 500 });

    }

};
const isEmailVerified = async (req, res, next) => {

    try {

        const isEmailExistsAndVerified = await models.users.findOne({
            where: {
                phone: req.body.email,
                isEmailVerified: true
            },
            raw: true
        });
        if (!isEmailExistsAndVerified) {

            return next({ msg: 126, code: 400 });

        }
        return next();

    } catch (error) {

        logger.error(error);
        return next({ msg: 3067, code: 500 });

    }

};
const isEmailExists = async (req, res, next) => {

    try {

        const isEmail = await models.users.findOne({
            where: {
                email: req.body.email
            },
            raw: true
        });
        if (isEmail) {

            return next({ msg: 106, code: 400 });

        }

        return next();

    } catch (error) {

        logger.error(error);
        return next({ msg: 107, code: 500 });

    }

};
const isCountryIdExists = async (req, res, next) => {

    try {

        const isCountry = await models.countries.count({
            where: {
                id:req.body.countryId
            },
            raw: true
        });
        if (!isCountry) {

            return next({ msg: 1000, code: 400 });

        }

        return next();

    } catch (error) {

        logger.error(error);
        return next({ msg: 3067, code: 500 });

    }

};
const isEmailExistsDoseNotExists = async (req, res, next) => {

    try {

        const isEmail = await models.users.findOne({
            where: {
                email: req.body.email
            },
            raw: true
        });
        if (!isEmail) {

            return next({ msg: 116, code: 400 });

        }
        return next();

    } catch (error) {

        logger.error(error);
        return next({ msg: 107, code: 500 });

    }

};

const verifyEmailOrPhoneAndPassword = (req, res, next) => {

    try {

        req.body.password = req.body.oldPassword;
        if (req.user.isEmailVerified) {

            req.body.email = req.user.email;
            return authController.userSignIn('user-email-login', req, res, next);

        } else if (req.user.isPhoneVerified) {

            req.body.phoneNumber = req.user.phone;
            return authController.userSignIn('user-phone-login', req, res, next);

        }
        return next({ msg: 127, code: 400 });

    } catch (err) {

        console.log(err);
        return next({ msg: 3067, code: 500 });

    }

};

module.exports = {
    isPhoneNumberExists,
    isEmailExists,
    isPhoneNumberDoseNotExists,
    isEmailExistsDoseNotExists,
    verifyEmailOrPhoneAndPassword,
    isCountryIdExists,
    isPhoneVerified,
    isEmailVerified
};