const countryController = require('../controllers/countries.controllers'),
    // authController = require('../controllers/auth.controllers'),
    countryValidator = require('../validators/countries.validators'),
    // userHelper = require('../controllers/helpers/users.helper'),
    fileUpload = require('../../../configurations/config.multer'),
    profileImage = fileUpload.upload(global.config.aws.s3.folders.profileImages),
    passport = require('passport');

module.exports = (app, version) => {

    const moduleName = '/countries';
    app.get(
        `${version + moduleName}`,
        countryValidator.validateCountryListing,
        countryController.fetchCountries

    );

};
