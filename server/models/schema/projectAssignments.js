module.exports = (sequelize, DataTypes) => {
  const ProjectAssignments = sequelize.define('project_assignments', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    }
  });

  ProjectAssignments.associate = models => {
    ProjectAssignments.hasMany(models.submissions);
  }

  return ProjectAssignments;
};
