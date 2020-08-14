module.exports = (sequelize, DataTypes) => {
    const Assignments = sequelize.define('assignments', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        file: {
            type: DataTypes.STRING(60),
            allowNull: true,
        },
        title: {
            type: DataTypes.STRING(20),
        },
        subdate: {
            type: DataTypes.DATE,
        },
        maxmark: {
            type: DataTypes.INTEGER,
        },
        group_assignment: {
            type: DataTypes.BOOLEAN,
        },
        description: {
            type: DataTypes.STRING(60),
            allowNull: false,
        },
    });

    Assignments.associate = models => {
        Assignments.belongsToMany(models.projects, {through: models.project_assignments});
    }

    return Assignments;
};
