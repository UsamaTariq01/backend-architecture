const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split('Bearer ')[1];

    if (token === null) { return res.sendStatus(401); }

    jwt.verify(token, global.config.jwtSetting.secret, (err, user) => {

        if (err) { return res.sendStatus(403); }

        req.user = user;

        return next();

    });

};

module.exports = {
    authenticate
};