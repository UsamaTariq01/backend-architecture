const glob = require('glob'),
    fs = require('fs'),
    _ = require('lodash'),
    path = require('path'),
    os = require('os'),
    Logger = require('./logger.winston');

Logger.info('loading success messages...!!!!');
const globPath = 'modules/**/*.success.json';
let newPath = path.join(__dirname, '../modules');
newPath = `${newPath}/**/*.success.json`;

const successMessages = {
    '0000': {
        msg: {
            EN: '',
            AR: ''
        }
    },
    '0001': {
        msg: {
            EN: 'Image uploaded successfully',
            AR: 'تم تحميل الصورة بنجاح'
        }
    }
};

if (os.platform() === 'win32') {

    glob.sync(globPath).forEach(function (file) {

        _.extend(successMessages, JSON.parse(fs.readFileSync(file, 'utf-8')));
        Logger.info(`success file: ${file} is loaded`);

    });

} else {

    const syncedPath = glob.sync(newPath);
    syncedPath.forEach(function (file) {

        _.extend(successMessages, JSON.parse(fs.readFileSync(file, 'utf-8')));
        Logger.info(`success file: ${file} is loaded`);

    });

}

module.exports = successMessages;
