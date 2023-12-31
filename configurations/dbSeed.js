const Logger = require('./logger.winston'),
    countries = require('./config.countries.json');

const dataBaseSeed = (models, Sequelize) => {

    const createCountries = async () => {

        if ('countries' in models) {

            Logger.info('countries  seed');

            const isCountries = await models.countries.count({});
            if (!isCountries) {

                Logger.info('no countries  found, seed running');

                await models.countries.bulkCreate(countries);

            }

        }

    };

    const addSeed = async () => {

        await createCountries();

    };
    addSeed();

};

module.exports = dataBaseSeed;

