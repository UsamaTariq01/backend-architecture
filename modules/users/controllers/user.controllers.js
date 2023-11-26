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
                msg: 103,
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





module.exports = {
    userProfileResponse
};