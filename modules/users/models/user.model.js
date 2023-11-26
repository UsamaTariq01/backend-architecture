const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {

    class User extends sequelize.Sequelize.Model { }

    User.init({
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
        // fullName: {
        //     type: DataTypes.VIRTUAL,
        //     get () {

        //         return `${this.firstName} ${this.lastName}`;

        //     },
        //     set (value) {

        //         throw new Error('Do not try to set the `fullName` value!');

        //     }
        // },
        gender: {
            type: DataTypes.ENUM,
            values: [ 'male', 'female', 'other' ]
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
            // set (value) {

            //     const hashedPassword = bcrypt.hashSync(value,
            //         global.config.bcryptSetting.saltRounds);
            //     this.setDataValue('password', hashedPassword);

            // }
        },
        forgotPasswordToken: {
            type: DataTypes.STRING(150),
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING,
            field: 'phone',
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER, // 0 inactive, 1 active, 2 deleted
            field: 'status',
            defaultValue: 1
        },
        isPhoneVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        phoneVerificationCode: {
            type: DataTypes.STRING(5),
            allowNull: true
        },
        phoneVerificationDateTime: {
            type: DataTypes.DATE(6),
            allowNull: true
        },
        emailVerificationDateTime: {
            type: DataTypes.DATE(6),
            allowNull: true
        },
        isEmailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        emailVerificationLink: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        faceId: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        biometric: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        language: {
            type: DataTypes.ENUM('EN', 'FR', 'AR'),
            defaultValue: 'EN'
        },
        userSessionToken: {
            type: DataTypes.STRING,
            defaultValue: null,
            allowNull: true
        }



    }, {
        // getterMethods: {
        //     fullName () {

        //         return `${this.firstName} ${this.lastName}`;

        //     }
        // },
        setterMethods: {
            password (value) {

                const hashedPassword = bcrypt.hashSync(value,
                    global.config.bcryptSetting.saltRounds);
                this.setDataValue('password', hashedPassword);

            }
        },
        indexes: [
            {
                fields: [ 'email', 'phone' ]
            }
        ],
        sequelize,
        modelName: 'users',
        paranoid: true
    });
    // Compare a password with the hashed password stored in the database
    User.prototype.comparePassword = async function (candidatePassword) {

        const isPasswordCorrect = await bcrypt.compare(candidatePassword, this.password);
        return isPasswordCorrect;

    };

    return User;

};