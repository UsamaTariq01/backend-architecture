const Response = require('../../../configurations/config.response'),
    models = require('../../../configurations/config.sequelize').models,
    moment = require('moment'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    passport = require('../../../configurations/config.passport'),
    globalUtils = require('../../utils');


const userProfileResponse = (req, res, next) => {

    try {

        console.log(req.user);

        return Response.sendResponse(
            res,
            {
                msg: 105,
                data: {
                    user: req.user

                },
                lang: req.params.lang
            }
        );

    } catch (err) {

        console.log(err);
        return next({ msg: 3067 });

    }

};
const updateUserProfile = async (req, res, next) => {

    try {

        const {
            name, faceId, biometric, language, profileImage, gender
        } = req.body;

        await models.users.update({
            name,
            faceId,
            biometric,
            language,
            profileImage,
            gender
        },
        {
            where : {
                id: req.user.id
            }
        }

        );

        return Response.sendResponse(
            res,
            {
                msg: 104,
                data: {
                    user: req.user

                },
                lang: req.params.lang
            }
        );

    } catch (err) {

        console.log(err);
        return next({ msg: 3067 });

    }

};
const resetUserPassword = async (req, res, next) => {

    try {

        const { newPassword } = req.body;

        await models.users.update({
            password: newPassword
        },
        {
            where: {
                id: req.user.id
            }
        });

        return Response.sendResponse(
            res,
            {
                msg: 106,
                data: {},
                lang: req.params.lang
            }
        );

    } catch (err) {

        console.log(err);
        return next({ msg: 3067 });

    }

};





module.exports = {
    userProfileResponse,
    updateUserProfile,
    resetUserPassword
};