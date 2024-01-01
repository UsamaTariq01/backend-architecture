const models = require('../../../../configurations/config.sequelize').models,
    logger = require('../../../../configurations/logger.winston');

const isPhoneNumberExists = async (req, res, next) => {

    try {

        const isPhoneNumberExists = await models.users.findOne({
            where: {
                phone: req.body.phoneNumber
            },
            raw: true
        });
        if (isPhoneNumberExists) {

            return next({ msg: 103 });

        }

        return next();

    } catch (error) {

        logger.error(error);
        return next({ msg: 107 });

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

            return next({ msg: 113 });

        }

        return next();

    } catch (error) {

        logger.error(error);
        return next({ msg: 107 });

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

            return next({ msg: 106 });

        }

        return next();

    } catch (error) {

        logger.error(error);
        return next({ msg: 107 });

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

            return next({ msg: 1000 });

        }

        return next();

    } catch (error) {

        logger.error(error);
        return next({ msg: 3067 });

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

            return next({ msg: 116 });

        }
        console.log('herere');
        return next();

    } catch (error) {

        logger.error(error);
        return next({ msg: 107 });

    }

};

const setupUserEmail = async (req, res, next) => {

    try {

        req.body.email = req.user.email;
        req.body.password = req.body.oldPassword;
        return next();

    } catch (err) {

        console.log(err);
        return next({ msg: 3067 });

    }

};

module.exports = {
    isPhoneNumberExists,
    isEmailExists,
    isPhoneNumberDoseNotExists,
    isEmailExistsDoseNotExists,
    setupUserEmail,
    isCountryIdExists
};