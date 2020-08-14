module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('projects', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: true
            // don't know if we'll need this or not
        },
        archived: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
            // don't know if we'll need this or not
        },
        status: {
            type: DataTypes.STRING(1),
            allowNull: false,
            // change this so it only accepts certain values
              // statuses:
                // A = proposal accepted
                // C = proposal changes required
                // P = proposal pending review
                // R = proposal requested
            // * may need to have this on the project proposal in the future
            // to accomadate seperate statuses for the actaual project (in progress, assigned etc.)
            // we shall see...
        }
    });

    Project.associate = models => {
        // Project.hasMany(models.project_assignments);
        Project.belongsTo(models.clients);
        Project.belongsToMany(models.assignments, {through: models.project_assignments});
    }

    return Project;
};
