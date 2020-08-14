module.exports = (sequelize, DataTypes) => {
  const Submissions = sequelize.define('submissions', {
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
  });

  Submissions.associate = models => {
    Submissions.belongsTo(models.students, {onDelete: 'cascade'});
    Submissions.belongsTo(models.project_groups, {onDelete: 'cascade'});
    Submissions.belongsTo(models.project_assignments, {onDelete: 'cascade'});
  }

  return Submissions;
};
