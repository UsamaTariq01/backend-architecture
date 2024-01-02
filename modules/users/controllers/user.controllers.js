const Response = require('../../../configurations/config.response'),
    models = require('../../../configurations/config.sequelize').models,
    moment = require('moment'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    passport = require('../../../configurations/config.passport'),
    globalUtils = require('../../utils');

//* *********************** user profile response *************************/
const userProfileResponse = (req, res, next) => {

    try {

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
//* ******************************* update user profile *********************************** */
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
//* ************************** change user own password *************************** */
const changePassword = async (req, res, next) => {

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
//* ***************************** change user email *****************************/
const changeEmail = async (req, res, next) => {

    try {

        const { email } = req.body;

        await models.users.update({
            email: email
        },
        {
            where: {
                id: req.user.id
            }
        });

        return Response.sendResponse(
            res,
            {
                msg: 107,
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
    changePassword,
    changeEmail
};