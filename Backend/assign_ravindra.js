const sequelize = require('./config/db');
const User = require('./models/User');
const Request = require('./models/Request');
const { Op } = require('sequelize');

const assignTasks = async () => {
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
            // Create him if missing (fallback)
            // But from screenshot we know he exists.
            process.exit(1);
        }

        console.log(`Found user: ${user.first_name} ${user.last_name} (${user.id})`);

        // 2. Assign some requests to him
        // Get some requests (e.g., all of them or specific ones)
        const requests = await Request.findAll();

        if (requests.length === 0) {
            console.log('No requests found to assign.');
            process.exit(0);
        }

        // Assign the first 3 requests to Ravindra
        for (let i = 0; i < Math.min(3, requests.length); i++) {
            requests[i].assigned_technician_id = user.id;
            // Ensure status is not 'New' so it shows up if filtered by status, 
            // though the dashboard filters by assignee.
            if (requests[i].status === 'New') requests[i].status = 'In Progress';
            await requests[i].save();
            console.log(`Assigned request ${requests[i].id} to ${user.first_name}`);
        }

        // 3. Create a customized request just for him
        await Request.create({
            subject: 'Inspect Main Generator',
            description: 'Urgent inspection required for the backup generator.',
            type: 'Corrective',
            priority: 'Critical',
            status: 'New',
            equipment_id: 1, // Assuming ID 1 exists from seed
            requestor_id: 1, // Admin
            assigned_technician_id: user.id
        });
        console.log('Created and assigned new "Inspect Main Generator" task.');

        console.log('✅ Assignments updated.');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

assignTasks();
