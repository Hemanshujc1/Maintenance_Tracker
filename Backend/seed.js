const sequelize = require('./config/db');
const User = require('./models/User');
const Department = require('./models/Department');
const MaintenanceTeam = require('./models/MaintenanceTeam');
const Equipment = require('./models/Equipment');
const Request = require('./models/Request');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to database.');

        // 1. Departments
        const departmentsData = [
            { name: 'Production', description: 'Manufacturing floor' },
            { name: 'R&D', description: 'Research and Development' },
            { name: 'Logistics', description: 'Warehouse and Shipping' },
            { name: 'HR', description: 'Human Resources' }
        ];
        const departments = await Department.bulkCreate(departmentsData, { updateOnDuplicate: ['name'] });
        console.log('Departments seeded.');

        // 2. Maintenance Teams
        const teamsData = [
            { name: 'Electrical', description: 'High voltage and electronics' },
            { name: 'Mechanical', description: 'Gears, motors, and hydraulics' },
            { name: 'General', description: 'General facility maintenance' }
        ];
        const teams = await MaintenanceTeam.bulkCreate(teamsData, { updateOnDuplicate: ['name'] });
        console.log('Maintenance Teams seeded.');

        // 3. Users
        const hashedPassword = await bcrypt.hash('password123', 10);
        const usersData = [
            // Admin
            { first_name: 'Admin', last_name: 'User', email: 'admin@example.com', password_hash: hashedPassword, role: 'Admin', status: 'Active' },
            // Managers
            { first_name: 'Manager', last_name: 'One', email: 'manager@example.com', password_hash: hashedPassword, role: 'Manager', department_id: departments[0].id, status: 'Active' },
            // Technicians
            { first_name: 'John', last_name: 'Tech', email: 'tech1@example.com', password_hash: hashedPassword, role: 'Technician', maintenance_team_id: teams[0].id, status: 'Active' },
            { first_name: 'Sarah', last_name: 'Fix', email: 'tech2@example.com', password_hash: hashedPassword, role: 'Technician', maintenance_team_id: teams[1].id, status: 'Active' },
            { first_name: 'Mike', last_name: 'Wrench', email: 'tech3@example.com', password_hash: hashedPassword, role: 'Technician', maintenance_team_id: teams[2].id, status: 'Active' },
            // Employees
            { first_name: 'Alice', last_name: 'Worker', email: 'alice@example.com', password_hash: hashedPassword, role: 'Employee', department_id: departments[0].id, status: 'Active' },
            { first_name: 'Bob', last_name: 'Builder', email: 'bob@example.com', password_hash: hashedPassword, role: 'Employee', department_id: departments[2].id, status: 'Active' },
            { first_name: 'Eve', last_name: 'User', email: 'eve@example.com', password_hash: hashedPassword, role: 'Employee', department_id: departments[1].id, status: 'Inactive' }
        ];

        // Upsert users based on email
        for (const u of usersData) {
            await User.upsert(u);
        }
        console.log('Users seeded.');

        // Re-fetch users to get IDs
        const allUsers = await User.findAll();
        const tech1 = allUsers.find(u => u.email === 'tech1@example.com');
        const tech2 = allUsers.find(u => u.email === 'tech2@example.com');
        const emp1 = allUsers.find(u => u.email === 'alice@example.com');

        // 4. Equipment
        const equipmentData = [
            { name: 'CNC Machine 01', serial_number: 'CNC-001', description: 'Main milling machine', location: 'Production Floor A', status: 'Active', department_id: departments[0].id, maintenance_team_id: teams[1].id },
            { name: 'Conveyor Belt 03', serial_number: 'CON-003', description: 'Packing line conveyor', location: 'Warehouse', status: 'Maintenance', department_id: departments[2].id, maintenance_team_id: teams[1].id },
            { name: 'HVAC Unit 2', serial_number: 'HVAC-002', description: 'Roof unit B', location: 'Roof', status: 'Active', department_id: departments[3].id, maintenance_team_id: teams[2].id },
            { name: 'Lathe Machine', serial_number: 'LAT-101', description: 'Precision lathe', location: 'Workshop', status: 'Scrapped', department_id: departments[0].id, maintenance_team_id: teams[1].id },
            { name: '3D Printer', serial_number: 'PRT-300', description: 'Prototyping printer', location: 'R&D Lab', status: 'Active', department_id: departments[1].id, maintenance_team_id: teams[0].id }
        ];

        // Upsert equipment
        for (const e of equipmentData) {
            await Equipment.upsert(e);
        }
        console.log('Equipment seeded.');

        const allEquipment = await Equipment.findAll();

        // 5. Requests
        const requestsData = [
            { subject: 'Conveyor Belt Jammed', description: 'Packages keep getting stuck near sensor B.', type: 'Corrective', priority: 'High', status: 'In Progress', equipment_id: allEquipment[1].id, requestor_id: emp1.id, assigned_technician_id: tech2.id, created_at: new Date(new Date() - 86400000) },
            { subject: 'CNC Routine Check', description: 'Quarterly maintenance check.', type: 'Preventive', priority: 'Medium', status: 'New', equipment_id: allEquipment[0].id, requestor_id: allUsers[0].id, assigned_technician_id: null, created_at: new Date() },
            { subject: 'HVAC Filter Change', description: 'Filter replacement needed.', type: 'Preventive', priority: 'Low', status: 'Repaired', equipment_id: allEquipment[2].id, requestor_id: allUsers[1].id, assigned_technician_id: tech1.id, completion_date: new Date(), duration_hours: 2.5 }
        ];

        // Only insert requests if table is empty to avoid duplicates on re-run (or just insert)
        // For simplicity, just create
        await Request.bulkCreate(requestsData);
        console.log('Requests seeded.');

        console.log('✅ Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
};

seedDatabase();
