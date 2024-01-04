const adminController = require('../controllers/admins.controllers'),
    adminValidator = require('../validators/admins.validators'),
    adminHelper = require('../controllers/helpers/admins.helper'),
    passport = require('passport');

module.exports = (app, version) => {

    const moduleName = '/admin/user';

    app.get(
        `${version + moduleName}/listing`,
        passport.authenticate('admin', { session: false }),
        adminValidator.validateListing,
        adminValidator.validateUserListingFilters,
        adminController.fetchUsers

    );
    app.patch(
        `${version + moduleName}/status-update/:userId/:status`,
        passport.authenticate('admin', { session: false }),
        adminValidator.validateUserId,
        adminValidator.validateStatus,
        adminHelper.isUserExists,
        adminController.updateUserStatus

    );


};
