const sequelize = require('./config/db');
const User = require('./models/User');
const Request = require('./models/Request');
const { Op } = require('sequelize');

const checkTasks = async () => {
    try {
        await sequelize.authenticate();

        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { first_name: { [Op.like]: '%Ravindra%' } },
                    { email: { [Op.like]: '%ravindra%' } }
                ]
            }
        });

        if (!user) {
            console.log('User Ravindra not found');
            process.exit(1);
        }

        const requests = await Request.findAll({
            where: { assigned_technician_id: user.id }
        });

        console.log(`Tasks for ${user.first_name} (${user.id}):`);
        const counts = { 'New': 0, 'In Progress': 0, 'Repaired': 0, 'Scrap': 0 };

        requests.forEach(r => {
            console.log(`- [${r.status}] ${r.subject}`);
            counts[r.status] = (counts[r.status] || 0) + 1;
        });

        console.log('Counts:', counts);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkTasks();
