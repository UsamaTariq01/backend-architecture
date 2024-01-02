const adminController = require('../controllers/admins.controllers'),
    adminValidator = require('../validators/admins.validators'),
    adminHelper = require('../controllers/helpers/admins.helper');

module.exports = (app, version) => {

    const moduleName = '/admin/auth';

    app.post(
        `${version + moduleName}/login`,
        adminValidator.validateEmail,
        adminValidator.validatePassword,
        adminHelper.isAdminEmailExists,
        adminController.adminLogIn,
        adminController.adminLoginSuccessResponse

    );

};
