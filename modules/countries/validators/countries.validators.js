const GlobalLib = require('../../utils'),
    Logger = require('../../../configurations/logger.winston'),
    { check, param, query } = require('express-validator');


const validateCountryListing = async (req, res, next) => {

    try {

        await query('limit').optional().trim().escape().isInt({ min: 1 }).withMessage(1004).run(req);
        await query('offset').optional().trim().escape().isInt({ min: 0 }).withMessage(1005).run(req);
        await query('searchText').optional().trim().escape().isString().withMessage(1006).run(req);
        await query('sort').optional().trim().escape().isString().isIn(['DESC', 'ASC']).withMessage(1007).run(req);


        return GlobalLib.ValidateResponse('validate country listings', req, res, next);

    } catch (err) {

        Logger.error(err);
        return next({ code: 2 });

    }

};

module.exports = {

    validateCountryListing

};
