const { validationResult } = require('express-validator'),
    Logger = require('../../configurations/logger.winston');
    // {errorResponse} = require('../../configuration/validation.express-validator');


const ValidateResponse = (msg, req, res, next) => {


    const response = validationResult(req).formatWith({ onlyFirstError: true });
    console.log(response,'here');
    if (!response.isEmpty() && response.errors.length > 0) {
        console.log(response.errors);
        const errorsArray = response.errors;
        Logger.error(`message: ${msg}, error: ${errorsArray[0]}`);
        return next({ msg: errorsArray[0].msg });

    }
    return next();

};

module.exports = {
    ValidateResponse
};