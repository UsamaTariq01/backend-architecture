const { glob } = require('glob'),
    Sequelize = require('sequelize'),
    path = require('path'),
    Logger = require('./logger.winston'),
    // { promisify } = require('util'),
    root = path.normalize(`${__dirname}/../`);
const models = {};

const sequelize = new Sequelize(
    global.config.db.name,
    global.config.db.username,
    global.config.db.password,
    {
        host:    global.config.db.host,
        port:    global.config.db.port,
        dialect: 'mysql',
        define:  {

            charset:        'utf8mb4',
            dialectOptions: {
                collate: 'utf8mb4_unicode_ci'
            },
            timestamps:      true,
            freezeTableName: true,
            underscored:     false
        },
        logging: (global.config.db.enableSequelizeLog) ? message => Logger.info(message) : false,
        pool:    {
            max:     10,
            min:     0,
            idle:    10000,
            acquire: 40000
        }

    });



(async () => {

    try {

        const files = await glob('modules/**/*.model.js');

        Logger.info('models are loading ...');

        let model;

        files.forEach(file => {

            Logger.info(`Loading model ${file}`);
            model = require(path.join(root, file))(sequelize, Sequelize.DataTypes);
            models[model.name] = model;

        });

        sequelize
            .sync({ force: global.config.db.forceSync })
            .then(() => {

                sequelize
                    .authenticate()
                    .then(() => {

                        const dataBaseSeeding = require('./dbSeed');
                        dataBaseSeeding(models, sequelize);
                        Logger.info(
                            `DataBase Connection established successfully: Host ${global.config.db.host} 
                        database ${global.config.db.name}`
                        );

                    }).catch((err) => {

                        Logger.error(`Unable to connect to the DB: ${err}`);
                        throw new Error({ error: 'error occured while loading models' });

                    });

            }).catch(err => {

                Logger.error(`Unable to connect to the database: ${err}`);

            });

        Object.keys(models).forEach(model => {

            if (Object.hasOwn(models[model].options, 'associate')) {

                models[model].options.associate(models);

            }
            if ('associate' in models[model]) {

                models[model].associate(models);

            }

        });

    } catch (err) {

        console.log(err);
        Logger.error(err);
        throw new Error({ error: 'error occurred while loading models' });

    }

})();

module.exports = {
    sequelize,
    Sequelize,
    models
};