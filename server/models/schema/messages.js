module.exports = (sequelize, DataTypes) => {
    const Messages = sequelize.define('messages', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          messageTitle: {
            type: DataTypes.STRING(20),
        },
        messageContent: {
            type: DataTypes.STRING(50),
        },
    });

    //for fk UserID - is set to pk of Users table
    Messages.associate = models => {
        // Messages.belongsTo(models.users, {as: 'source', foreignKey: 'id'});
        Messages.belongsTo(models.users, {as: 'sourceUser', onDelete: 'cascade'} );
        Messages.belongsTo(models.users, {as: 'destinationUser', onDelete: 'cascade'} );
    }

    return Messages;
};
  