const sequelize = require('./config/db');
const User = require('./models/User');
const Request = require('./models/Request');
const { Op } = require('sequelize');

const populateAllColumns = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected.');

        // 1. Find Ravindra
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { first_name: { [Op.like]: '%Ravindra%' } },
                    { email: { [Op.like]: '%ravindra%' } }
                ]
            }
        });

        if (!user) {
            console.error('User Ravindra not found!');
            process.exit(1);
        }

        console.log(`Found user: ${user.first_name} ${user.last_name} (${user.id})`);

        // 2. Ensure at least one task for each status
        const statuses = ['New', 'In Progress', 'Repaired', 'Scrap'];

        for (const status of statuses) {
            const count = await Request.count({
                where: {
                    assigned_technician_id: user.id,
                    status: status
                }
            });

            if (count === 0) {
                console.log(`No tasks found for status '${status}'. Creating one...`);

                // Create a dummy task
                await Request.create({
                    subject: `Dummy Task - ${status}`,
                    description: `Automatically created task to populate the '${status}' column.`,
                    type: 'Corrective',
                    priority: 'Medium',
                    status: status, // Important
                    equipment_id: 1, // Using first equipment
                    requestor_id: 1, // Admin
                    assigned_technician_id: user.id
                });
                console.log(`Created task for '${status}'.`);
            } else {
                console.log(`Status '${status}' already has ${count} tasks.`);
            }
        }

        console.log('✅ All columns populated.');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

populateAllColumns();
