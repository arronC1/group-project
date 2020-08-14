module.exports = (sequelize, DataTypes) => {
    const ModuleLeaders = sequelize.define('module_leaders', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstname: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        surname: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
    });

    return ModuleLeaders;
};
  