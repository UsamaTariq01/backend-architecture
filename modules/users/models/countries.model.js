module.exports = (sequelize, DataTypes) => {

    class Countries extends sequelize.Sequelize.Model { }

    Countries.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id'
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        countryNameLocal: {
            type: DataTypes.STRING,
            allowNull: true
        },
        countryCode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        currencyCode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        currencyNameEn: {
            type: DataTypes.STRING,
            allowNull: true
        },
        officialLanguageCode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        officialLanguageNameEn: {
            type: DataTypes.STRING,
            allowNull: true
        },
        officialLanguageNameLocal: {
            type: DataTypes.STRING,
            allowNull: true
        },
        countryCallingCode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        region: {
            type: DataTypes.STRING,
            allowNull: true
        },
        flag: {
            type: DataTypes.STRING,
            allowNull: true
        }

    }, {

        indexes: [
            {
                fields: [
                    'name',
                    'region'
                ]
            }
        ],
        sequelize,
        modelName: 'countries',
        paranoid: true
    });
    Countries.associate = function (models) {

        Countries.hasMany(models.users, {
            foreignKey: {
                name: 'countryId',
                field: 'countryId',
                type: DataTypes.INTEGER
            },
            allowNull: false
        });

    };
    return Countries;

};