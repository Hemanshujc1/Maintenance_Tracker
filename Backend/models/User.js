const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Department = require('./Department');
const MaintenanceTeam = require('./MaintenanceTeam');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('Admin', 'Manager', 'Technician', 'Employee'),
    allowNull: false
  },
  department_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Department,
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
  status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    defaultValue: 'Active'
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true
});

// Associations
User.belongsTo(Department, { foreignKey: 'department_id' });
User.belongsTo(MaintenanceTeam, { foreignKey: 'maintenance_team_id' });

module.exports = User;
