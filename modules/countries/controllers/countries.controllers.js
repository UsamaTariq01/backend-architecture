
const Response = require('../../../configurations/config.response'),
    models = require('../../../configurations/config.sequelize').models,
    { Op } = require('sequelize');


const fetchCountries = async (req, res, next) => {

    try {

        const limit = parseInt(req.query.limit) || 10,
            offset = parseInt(req.query.offset) || 0,
            sort = req.query.sort || 'DESC',
            searchText = req.query.searchText || undefined;

        let whereCluase = {};
        if (req.query.searchText && req.query.searchText !== '') {

            whereCluase = {

                [Op.or]: [
                    {
                        name: {
                            [Op.like]: `%${searchText}%`
                        }
                    },
                    {
                        region: {
                            [Op.like]: `%${searchText}%`
                        }
                    },
                    {
                        countryCallingCode: {
                            [Op.like]: `%${searchText}%`
                        }
                    }
                ]
            };

        }
        const data = await models.countries.findAndCountAll({
            where: whereCluase,
            attributes: ['id', 'name', 'countryCallingCode', 'flag', 'region'],
            raw: true,
            limit: limit,
            offset: offset,
            order: [
                ['name', sort]
            ]
        });
        return Response.sendResponse(
            res,
            {
                msg: 1000,
                data: {
                    data

                },
                lang: req.params.lang
            }
        );

    } catch (error) {

        return next({ msg: 3067, code: 500 });

    }

};


module.exports = {
    fetchCountries
};