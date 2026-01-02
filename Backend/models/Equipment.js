const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Department = require('./Department');
const MaintenanceTeam = require('./MaintenanceTeam');
const User = require('./User'); // For assigned employee

const Equipment = sequelize.define('Equipment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  serial_number: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT
  },
  purchase_date: {
    type: DataTypes.DATEONLY
  },
  warranty_expiry: {
    type: DataTypes.DATEONLY
  },
  location: {
    type: DataTypes.STRING(150)
  },
  status: {
    type: DataTypes.ENUM('Active', 'Maintenance', 'Scrapped'),
    defaultValue: 'Active'
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  department_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Department,
      key: 'id'
    }
  },
  assigned_employee_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  maintenance_team_id: {
    type: DataTypes.INTEGER,
    references: {
      model: MaintenanceTeam,
      key: 'id'
    }
  },
  default_technician_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  tableName: 'equipment',
  timestamps: true,
  underscored: true
});

// Associations
Equipment.belongsTo(Department, { foreignKey: 'department_id' });
Equipment.belongsTo(MaintenanceTeam, { foreignKey: 'maintenance_team_id' });
Equipment.belongsTo(User, { as: 'assignedEmployee', foreignKey: 'assigned_employee_id' });
Equipment.belongsTo(User, { as: 'defaultTechnician', foreignKey: 'default_technician_id' });
// Circular dependency handled in Request.js now

module.exports = Equipment;
