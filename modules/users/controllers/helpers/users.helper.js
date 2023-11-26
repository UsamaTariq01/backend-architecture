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

module.exports = {
    isPhoneNumberExists,
    isEmailExists,
    isPhoneNumberDoseNotExists,
    isEmailExistsDoseNotExists
};