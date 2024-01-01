
const smsService = require('../../configurations/config.sms'),
    jwt = require('jsonwebtoken');

const generateRandomNumber =  () => {

    return Math.floor(1000 + (Math.random() * 9000));

};

const sendSMS = (data, cb) => {

    const sms = {
        to: data.phoneNo,
        text: data.message
    };

    smsService.sendMessage(sms, (err, res) => {

        if (err) {

            return cb(err);

        }
        return cb(null, res);

    });

};


const signJwt = (user) => {

    return jwt.sign(
        user,
        global.config.jwtSetting.secret,
        {
            algorithm: global.config.jwtSetting.algorithm,
            expiresIn: global.config.jwtSetting.expiration
        }
    );

};
module.exports = {
    generateRandomNumber,
    sendSMS,
    signJwt
};