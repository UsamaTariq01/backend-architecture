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
        if (req?.user?.language) {

            langCode = req.user.language;

        }

        if (error.msg && typeof error.msg === 'number') {

            errorMessage = `${global.errors[error.msg].msg[langCode]}`;

        } else {

            errorMessage = error;

        }


        Logger.error(` inside error handler: ${errorMessage}`);
        console.log(error);
        const response = error.status;
        res.status(400);
        if (error.code) {

            res.status(error.code);

        }
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
