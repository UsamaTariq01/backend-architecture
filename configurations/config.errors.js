const glob = require('glob'),
    fs = require('fs'),
    _ = require('lodash'),
    path = require('path'),
    os = require('os'),
    Logger = require('./logger.winston');

Logger.info('Loading Errors....!!!!');

const route = 'modules/**/*.errors.json';

let newPath = path.join(__dirname, '../modules');

newPath = `${newPath}/**/*.errors.json`;

const errorInitialized = {
    1: {
        'msg': {
            'en': '',
            'ar': '',
            'fr': ''
        }
    },
    2: {
        'msg': {
            'en': 'error occured while request validation',
            'ar': '',
            'fr': ''
        }
    },
    3: {
        'msg': {
            'en': 'error occured while uploading',
            'ar': '',
            'fr': ''
        }
    },
    3067: {
        'msg': {
            'en': 'sometihing went wrong please try again.',
            'ar': '',
            'fr': ''
        }
    }
};
if (os.platform() === 'win32') {

    glob.sync(route).forEach(function (file) {

        _.extend(errorInitialized, JSON.parse(fs.readFileSync(file, 'utf-8')));

        Logger.info(`error file: ${file} is loaded`);

    }

    );

} else {

    const syncedPath = glob.sync(newPath);

    syncedPath.forEach(function (file) {

        _.extend(errorInitialized, JSON.parse(fs.readFileSync(file, 'utf-8')));

        Logger.info(`error file: ${file} is loaded`);

    }

    );

}

module.exports = errorInitialized;