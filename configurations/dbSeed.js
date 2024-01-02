const Logger = require('./logger.winston'),
    countries = require('./config.countries.json');

const dataBaseSeed = (models, Sequelize) => {

    const createCountries = async () => {

        if ('countries' in models) {

            const isCountries = await models.countries.count({});
            if (!isCountries) {

                Logger.info('no countries  found, seed running');

                await models.countries.bulkCreate(countries);

            }

        }

    };
    const createAdmin = async () => {

        if ('admins' in models) {

            const isAdmin = await models.admins.count({});
            if (!isAdmin) {

                Logger.info('no Admin  found, seed running');

                await models.admins.bulkCreate([{
                    name: 'admin',
                    email: 'matnpay@yopmail.com',
                    password: 'Test@101'
                }]);

            }

        }

    };

    const addSeed = async () => {

        await createCountries();
        await createAdmin();

    };
    addSeed();

};

module.exports = dataBaseSeed;

