const sequelize = require('./config/db');
const Equipment = require('./models/Equipment');

const seedImages = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true }); // Important to add the new column
        console.log('Database synced (column added).');

        const equipment = await Equipment.findAll();

        // Unsplash placeholders based on keywords
        const getImageUrl = (name) => {
            if (name.toLowerCase().includes('cnc')) return 'https://images.unsplash.com/photo-1565439305411-9263f0a71921?auto=format&fit=crop&q=80&w=600';
            if (name.toLowerCase().includes('conveyor')) return 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600';
            if (name.toLowerCase().includes('hvac')) return 'https://images.unsplash.com/photo-1581093588401-fbb62a02f13b?auto=format&fit=crop&q=80&w=600';
            if (name.toLowerCase().includes('lathe')) return 'https://images.unsplash.com/photo-1621252179027-94459d27d3ee?auto=format&fit=crop&q=80&w=600';
            if (name.toLowerCase().includes('print')) return 'https://images.unsplash.com/photo-1631553128796-016091b659d8?auto=format&fit=crop&q=80&w=600';
            return 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600'; // Generic industrial
        };

        for (const item of equipment) {
            item.image_url = getImageUrl(item.name);
            await item.save();
            console.log(`Updated image for ${item.name}`);
        }

        console.log('✅ Equipment images seeded.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedImages();
