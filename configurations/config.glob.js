const path = require('path'),
    environment = process.env.NODE_ENV,
    logger = require('./logger.winston'),
    _ = require('lodash'),
    fs = require('fs');

global.config = {};

const initialConfiguration = () => {

    try {

        console.log('heree ', environment);
        global.config = require(path.join(__dirname, 'environments', `env.${environment}.json`));

        _.extend(global.config, JSON.parse(fs.readFileSync(path.join(__dirname, 'config.enums.json'), 'utf-8')));

        if (!Object.keys(global.config).length) {

            logger.info('error occurred while loading configurations');

            throw new Error ({ message: 'error occurred while loading configurations' });

        } else {

            logger.info(`configuration file ${environment}`);

        }

    } catch (err) {

        console.log(err);
        logger.error(`error occurred while loading initial configuration file ${err}`);

        throw new Error ({ message: 'error occurred while loading configurations' });

    }

};

module.exports = { initialConfiguration };