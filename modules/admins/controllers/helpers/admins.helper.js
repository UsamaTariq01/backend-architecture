const models = require('../../../../configurations/config.sequelize').models,
    logger = require('../../../../configurations/logger.winston');

const isAdminEmailExists = async (req, res, next) => {

    try {

        const isEmail = await models.admins.findOne({
            where: {
                email: req.body.email
            },
            raw: true
        });
        if (!isEmail) {

            return next({ msg: 116 });

        }
        return next();

    } catch (error) {

        logger.error(error);
        return next({ msg: 107 });

    }

};
module.exports = {
    isAdminEmailExists
};