const express = require('express'),
    cors = require('cors'),
    helmet = require('helmet'),
    http = require('http'),
    morganMiddleware = require('./logger.morgan'),
    logger = require('./logger.winston'),
    
    // var passport = require('passport');
    { initialConfiguration } = require('./config.glob');

// Passport and Session
// const passport = require('passport');
// const cookieSession = require('cookie-session');
// const bodyParser = require('body-parser');
// const session = require('express-session');



const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
// app.use(express.json());

// app.setup(serverHttps);
// Add the morgan middleware
app.use(morganMiddleware);
const options = {

    'origin':               '*',
    'methods':              'GET,PUT,POST,DELETE',
    'preflightContinue':    false,
    'optionsSuccessStatus': 200,
    'exposedHeaders':       'Access-Control-Allow-Method,Access-Control-Allow-Origin,Content-Type,Content-Length'

};

app.use(express.json({ limit: '50mb' }));

app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors(options));
// app.use(passport);

// Cookie Configuration
// app.use(cookieSession({
//     maxAge: 24 * 60 * 60 * 1000,
//     keys:   [ global.cookieKey ]
// }));

// app.use(session({
//     secret: "tHiSiSasEcRetStr",
//     resave: true,
//     saveUninitialized: true }));

// initialize passport
// app.use(session({
//     secret:            'tHiSiSasEcRetStr',
//     resave:            true,
//     saveUninitialized: true
// }));

// app.use(passport.initialize());
// app.use(passport.session());

// initializingPassport(passport);
// app.use(passport.initialize());
// app.use(passport.session());
// Add the line below, which you're missing:
initialConfiguration();
require('./config.sequelize');
global.errors = require('./config.errors');
require('./config.routes')(app);
require('./config.success');
require('./config.errorHandler')(app);
const passport = require('./config.passport');
app.use(passport.initialize());
const portNormalization = (val) => {

    const port = parseInt(val, 10);

    if (isNaN(port)) {

        // named pipe
        return val;

    }

    if (port >= 0) {

        // port number
        return port;

    }

    return false;

};


const whenError = (error) => {

    if (error.syscall !== 'listen') {

        throw error;

    }

    const binding = typeof global.port === 'string'
        ? `Pipe ${global.port}`
        : `Port ${global.port}`;

    switch (error.code) {

    case 'EACCES': {

        console.error(`${binding} requires elevated privileges`);
        process.exit(1);
        break;

    }
    case 'EADDRINUSE': {

        console.error(`${binding} is already in use`);
        process.exit(1);
        break;

    }
    default: {

        throw error;

    }

    }

};


const server = http.createServer(app);

const OnListen = () => {

    const addr = server.address();
    const bind = typeof addr === 'string'
        ? `pipe ${addr}`
        : `port ${addr.port}`;
    logger.info(`Server is listening on ${bind}`);

};

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {

    global.port = portNormalization(global.config.PORT ? `${global.config.PORT}${process.env.NODE_APP_INSTANCE}` : '3000');

} else {

    global.port = portNormalization(global.config.PORT || '3000');

}

server.listen(global.port);
server.on('error', whenError);
server.on('listening', OnListen);

server.setTimeout(500000);

