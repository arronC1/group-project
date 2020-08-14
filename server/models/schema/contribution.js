module.exports = (sequelize, DataTypes) => {
    const Contribution = sequelize.define('contribution', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        hours: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tasks: {
            type: DataTypes.STRING(60),
            allowNull: false,
        },
        week: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });

    Contribution.associate = models => {
        Contribution.belongsTo(models.students, {onDelete: 'cascade'});
        Contribution.belongsTo(models.project_groups, {onDelete: 'cascade'});
    }

    return Contribution;
  };
  