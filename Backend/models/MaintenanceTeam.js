const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MaintenanceTeam = sequelize.define('MaintenanceTeam', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'maintenance_teams',
  timestamps: true,
  underscored: true
});

module.exports = MaintenanceTeam;
