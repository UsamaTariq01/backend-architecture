const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {

    class Admin extends sequelize.Sequelize.Model { }

    Admin.init({
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
        profileImage: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'email'
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'password'
        },
        status: {
            type: DataTypes.INTEGER, // 0 inactive, 1 active, 2 deleted
            field: 'status',
            defaultValue: 1
        },
        language: {
            type: DataTypes.ENUM('EN', 'FR', 'AR'),
            defaultValue: 'EN'
        },
        AdminSessionToken: {
            type: DataTypes.STRING,
            defaultValue: null,
            allowNull: true
        }

    }, {
        setterMethods: {
            password (value) {

                const hashedPassword = bcrypt.hashSync(value,
                    global.config.bcryptSetting.saltRounds);
                this.setDataValue('password', hashedPassword);

            }
        },
        indexes: [
            {
                fields: ['email', 'name']
            }
        ],
        sequelize,
        modelName: 'admins',
        paranoid: true
    });
    // Compare a password with the hashed password stored in the database
    Admin.prototype.comparePassword = async function (candidatePassword) {

        const isPasswordCorrect = await bcrypt.compare(candidatePassword, this.password);
        return isPasswordCorrect;

    };


    return Admin;

};