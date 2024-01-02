
const Response = require('../../../configurations/config.response'),
    models = require('../../../configurations/config.sequelize').models,
    { Op } = require('sequelize'),
    passport = require('../../../configurations/config.passport'),
    globalUtils = require('../../utils');



// * ********************************88********admin log-In *****************************************************/
function adminLogIn (req, res, next) {

    return passport.authenticate('admin-email-login', (err, user, info) => {

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

}

//* ************************send login success response ************************/
const adminLoginSuccessResponse = (req, res, next) => {

    try {

        return Response.sendResponse(
            res,
            {
                msg: 2000,
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
    adminLogIn,
    adminLoginSuccessResponse
};