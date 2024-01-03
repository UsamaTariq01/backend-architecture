
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

        req.token = globalUtils.signJwtAdmin({
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

//* ****************************** fetch users *****************************************************/
const fetchUsers = async (req, res, next) => {

    try {

        const language = req.user.language,
            limit = parseInt(req.query.limit) || 10,
            offset = parseInt(req.query.offset) || 0,
            sort = req.query.sort || 'DESC',
            searchText = req.query.searchText || undefined,
            countryId = req.query.countryId || undefined,
            region = req.query.region || undefined,
            isEmailVerified = req.query.isEmailVerified || undefined,
            isPhoneVerified = req.query.isPhoneVerified || undefined;

        let whereCluase = {};
        let countryWhereCluase = {};
        if (req.query.searchText && req.query.searchText !== '') {

            whereCluase = {

                [Op.or]: [
                    {
                        name: {
                            [Op.like]: `%${searchText}%`
                        }
                    },
                    {
                        email: {
                            [Op.like]: `%${searchText}%`
                        }
                    },
                    {
                        phone: {
                            [Op.like]: `%${searchText}%`
                        }
                    }
                ]
            };

        }
        if (countryId) {

            whereCluase.countryId = countryId;

        }
        if (region) {

            countryWhereCluase = {
                region: region
            };

        }
        if (isEmailVerified && isEmailVerified === 'true') {

            whereCluase.isEmailVerified = true;

        }
        if (isPhoneVerified && isPhoneVerified === 'true') {

            whereCluase.isPhoneVerified = true;

        }
        if (isEmailVerified && isEmailVerified === 'false') {

            whereCluase.isEmailVerified = false;

        }
        if (isPhoneVerified && isPhoneVerified === 'false') {

            whereCluase.isPhoneVerified = false;

        }
        const data = await models.users.findAndCountAll({
            where: whereCluase,
            attributes: ['id', 'name', 'email', 'phone',
                'isEmailVerified', 'language', 'isPhoneVerified'],
            raw: true,
            limit: limit,
            offset: offset,
            include: [
                {
                    model: models.countries,
                    where: countryWhereCluase,
                    attributes: ['id']
                }
            ],
            order: [
                ['id', sort]
            ]
        });
        return Response.sendResponse(
            res,
            {
                msg: 2001,
                data: {
                    data

                },
                lang: language
            }
        );

    } catch (error) {

        return next({ msg: 3067 });

    }

};
module.exports = {
    adminLogIn,
    adminLoginSuccessResponse,
    fetchUsers
};