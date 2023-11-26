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
            'EN': '',
            'AR': ''
        }
    },
    2: {
        'msg': {
            'EN': 'error occured while request validation',
            'AR': ''
        }
    },
    3: {
        'msg': {
            'EN': 'error occured while uploading',
            'AR': ''
        }
    },
    3067: {
        'msg': {
            'EN': 'sometihing went wrong please try again.',
            'AR': ''
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