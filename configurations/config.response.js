
const successMessages = require('./config.success'),
    sendResponse = (res, data) => {

        data.msg = data.msg.toString();

        const Response = successMessages[data.msg].msg[global.config.languagesAllowed[data.lang]] || 'en';

        const responseToSend = {
            response: 200,
            success:  1,
            message:  Response,
            data:     data.data || {}
        };

        return res.json(responseToSend);

    };

module.exports = {
    sendResponse
};