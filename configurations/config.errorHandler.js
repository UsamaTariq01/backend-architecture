const Logger = require('./logger.winston');

module.exports = (app) => {

    app.use((req, res, next) => {

        const err = new Error('Not Found');

        err.status = 404;

        return next(err);

    });

    // Handling 500
    app.use((error, req, res, next) => {

        console.log('error.msg', error.msg);
        let errorMessage,
            // langCode = req.get('aspire-lang');
            langCode = (req.url).split('/')[3];

        langCode = global.config.languagesAllowed[langCode] || 'EN';

        if (error.msg && typeof error.msg === 'number') {

            errorMessage = `${global.errors[error.msg].msg[langCode]}`;

        } else if (error.message && typeof error.message === 'number') {

            errorMessage = `${global.errors[error.message].msg[[ langCode ]]}`;

        } else if (error.code && typeof error.code === 'number') {

            errorMessage = `${global.errors[error.message].msg[[ langCode ]]}`;

        } else {

            errorMessage = error;

        }


        Logger.error(` inside error handler: ${errorMessage}`);

        const response = error.status;

        return res.json(
            {
                success: false,
                message: errorMessage,
                code:    response,
                data:    {}

            }

        );

    }

    );

};
