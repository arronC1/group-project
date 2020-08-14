module.exports = (sequelize, DataTypes) => {
  const ProposalReview = sequelize.define('proposal_reviews', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    comment: {
      type: DataTypes.STRING(255),
      allowNull: true,
      // this will eventually be a file
    },
    // use the auto-created createdAt date for the proposal date
  });

  // function called associate that is ran in index.js that creates all fks
  
  ProposalReview.associate = function (models) {
    // The proposal that this review is linked to
    ProposalReview.belongsTo(models.project_proposals, {onDelete: 'cascade'});
    // The module leader that did the review
    ProposalReview.belongsTo(models.module_leaders, {onDelete: 'cascade'});
  }

  return ProposalReview;
};
