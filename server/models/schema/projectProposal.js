module.exports = (sequelize, DataTypes) => {
  const ProjectProposal = sequelize.define('project_proposals', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    brief: {
      type: DataTypes.STRING(255),
      allowNull: true, 
      // this will eventually be a file
    }
  });

  // function called associate that is ran in index.js that creates all fks
  ProjectProposal.associate = function (models) {
    ProjectProposal.belongsTo(models.projects, {onDelete: 'cascade'});
    ProjectProposal.hasOne(models.proposal_reviews, {onDelete: 'cascade'});
  }

  return ProjectProposal;
};
