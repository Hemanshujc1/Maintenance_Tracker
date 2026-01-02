const sequelize = require('./config/db');
const User = require('./models/User');

const checkUsers = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected.');
        const users = await User.findAll();
        console.log('Users found:', users.map(u => ({ id: u.id, name: `${u.first_name} ${u.last_name}`, email: u.email, role: u.role })));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUsers();
