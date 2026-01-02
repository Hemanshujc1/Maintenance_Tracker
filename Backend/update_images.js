const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
});

const updateImages = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const updates = [
            { name: 'CNC Machine 01', url: '/equipment_images/cnc_machine.png' },
            { name: 'Conveyor Belt 03', url: '/equipment_images/conveyor_belt.png' },
            { name: 'HvAC Unit 2', url: '/equipment_images/hvac_unit.png' }, // Note: Case sensitivity check in DB usually required, but using LIKE or exact match
            { name: 'HVAC Unit 2', url: '/equipment_images/hvac_unit.png' },
            { name: 'Lathe Machine', url: '/equipment_images/lathe_machine.png' },
            { name: '3D Printer', url: '/equipment_images/3d_printer.png' }
        ];

        for (const item of updates) {
            const [results] = await sequelize.query(
                `UPDATE equipment SET image_url = :url WHERE name LIKE :name`,
                {
                    replacements: { url: item.url, name: item.name }
                }
            );
            console.log(`Updated ${item.name} with ${item.url}`);
        }

        console.log('All images updated successfully.');
        process.exit();
    } catch (error) {
        console.error('Error updating images:', error);
        process.exit(1);
    }
};

updateImages();
