const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Equipment = require('./Equipment');
const User = require('./User');

const Request = sequelize.define('Request', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    subject: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    type: {
        type: DataTypes.ENUM('Corrective', 'Preventive'),
        allowNull: false
    },
    priority: {
        type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
        defaultValue: 'Medium'
    },
    status: {
        type: DataTypes.ENUM('New', 'In Progress', 'Repaired', 'Scrap'),
        defaultValue: 'New'
    },
    equipment_id: {
        type: DataTypes.INTEGER,
        allowNull: false, // Equipment is mandatory for a maintenance request
        references: {
            model: Equipment,
            key: 'id'
        }
    },
    requestor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    assigned_technician_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    scheduled_date: {
        type: DataTypes.DATE
    },
    completion_date: {
        type: DataTypes.DATE
    },
    duration_hours: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0.00
    },
    image_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'maintenance_requests',
    timestamps: true,
    underscored: true
});

// Associations
Request.belongsTo(Equipment, { foreignKey: 'equipment_id' });
Equipment.hasMany(Request, { foreignKey: 'equipment_id' }); // Defined here to avoid circular dependency
Request.belongsTo(User, { as: 'requestor', foreignKey: 'requestor_id' });
Request.belongsTo(User, { as: 'assignedTechnician', foreignKey: 'assigned_technician_id' });

module.exports = Request;
