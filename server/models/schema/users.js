module.exports = (sequelize, DataTypes) => {
    const bcrypt = require('bcrypt');
    
    const Users = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password_hint: DataTypes.STRING(50),
        user_type: {
            type: DataTypes.STRING(3),
            allowNull: false,
        }

    }, {
        // code adapted from https://www.codementor.io/mayowa.a/how-to-build-a-simple-session-based-authentication-system-with-nodejs-from-scratch-6vn67mcy3?fbclid=IwAR2Np-O5u5CBqM8lhbqOCcrjzB7s2KkUPBPN2peXyXnBno1Z3e5GaXxRMm0
        hooks: {
            beforeCreate: (user) => {
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(user.password, salt);
        },  //generates encrypted version of password, overwriting plain text password
        beforeUpdate: (user) => {
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(user.password, salt);
        }// For when a user resets their password
    }});

    Users.prototype.validPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };  //end reference

    // Users.associate = models => {
    //     Users.hasMany(models.messages, {as: 'sourceUser'});
    //     Users.hasMany(models.messages, {as: 'destinationUser'});
    // }
  
    return Users;
  };