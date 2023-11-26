
const successMessages = require('./config.success'),
    sendResponse = (res, data) => {

        data.msg = data.msg.toString();
        console.log('successMessages', successMessages);
        console.log('data.msg', data.msg);
        console.log('global.config.languagesAllowed', global.config.languagesAllowed);
        console.log('data.lang', data.lang);
        console.log('global.config.languagesAllowed[data.lang]', global.config.languagesAllowed[data.lang]);
        console.log('global.config.languagesAllowed[data.lang]', global.config.languagesAllowed[data.lang]);
        console.log(successMessages[data.msg.toString()]
            .msg[global.config.languagesAllowed[data.lang]]);
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