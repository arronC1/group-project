module.exports = (sequelize, DataTypes) => {
    const ProjectGroups = sequelize.define('project_groups', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        description: DataTypes.STRING(255),
    });

    ProjectGroups.associate = models => {
        ProjectGroups.belongsTo(models.supervisors);
        // ProjectGroups.belongsTo(models.clients);
        ProjectGroups.belongsTo(models.projects);
        ProjectGroups.hasMany(models.students);
    }

    return ProjectGroups;
};
