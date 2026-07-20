const mongoose = require('mongoose');
const Room = require('./models/Room');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDb connected successfully');

        // Auto-seed rooms if none exist
        const roomCount = await Room.countDocuments();
        if (roomCount === 0) {
            console.log('No rooms found in database. Seeding 20 default rooms...');
            const roomsToInit = Array.from({ length: 20 }, (_, i) => ({
                name: `Room ${i + 1}`,
                roomNumber: i + 1,
                status: 'Available'
            }));
            await Room.insertMany(roomsToInit);
            console.log('Database has been seeded with 20 rooms! 🌱');
        }
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;