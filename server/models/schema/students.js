module.exports = (sequelize, DataTypes) => {
    const Students = sequelize.define('students', {
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
        student_number: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
    });

    Students.associate = models => {
        Students.belongsTo(models.project_groups);
        Students.hasMany(models.contribution);
    }

    return Students;
};
