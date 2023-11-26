const express = require('express'),
    cors = require('cors'),
    helmet = require('helmet'),
    http = require('http'),
    morganMiddleware = require('./logger.morgan'),
    logger = require('./logger.winston'),
    { initialConfiguration } = require('./config.glob');




const app = express();

app.use(express.json({ limit: '50mb' }));

app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(helmet());


const options = {
    'origin':               '*',
    'methods':              'GET,PUT,POST,DELETE',
    'preflightContinue':    false,
    'optionsSuccessStatus': 200,
    'exposedHeaders':       'Access-Control-Allow-Method,Access-Control-Allow-Origin,Content-Type,Content-Length'

};


app.use(cors(options));


// Add the morgan middleware
app.use(morganMiddleware);

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

