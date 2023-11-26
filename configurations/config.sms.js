const logger = require('./logger.winston');

const sendSms = (msgInfo, cb) => {

    const client = require('twilio')(
        global.config.twilio.account_sid,
        global.config.twilio.auth_token
    );

    client.messages.create({
        from: global.config.twilio.phone_number,
        to: msgInfo.to,
        body: msgInfo.text
    }, (err, message) => {

        if (err) {

            logger.error(err);
            logger.error(`error occured while sending a message to ${msgInfo.to}`);
            return cb(err);

        }
        logger.info(`message sent to ${msgInfo.to}`);
        return;

    });

};

module.exports = {
    sendSms
};