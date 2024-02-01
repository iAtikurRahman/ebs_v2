const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Connection
const connectMongo = async (options = {}) => {
  try {
    // Connection details from environment variables
    const connectionDetails = {
      name: process.env.DB_MONGO_NAME,
      address: process.env.DB_MONGO_HOST,
      port: process.env.DB_MONGO_PORT,
      database: process.env.DB_MONGO_DATABASE,
      username: process.env.DB_MONGO_USERNAME,
      password: process.env.DB_MONGO_PASSWORD,
    };

    // Construct the MongoDB connection URL
    const mongoDBUrl = `mongodb://${connectionDetails.username}:${connectionDetails.password}@${connectionDetails.address}:${connectionDetails.port}/${connectionDetails.database}`;

    // Connect to MongoDB
    await mongoose.connect(mongoDBUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ...options,
    });

    console.log('Connected to MongoDB successfully');

    // Event listener for connection errors
    mongoose.connection.on('error', (error) => {
      console.error('Database Connection Error:', error.message);
    });
  } catch (error) {
    console.error('Could not connect to MongoDB:', error.message);
  }
};

// Export the connectMongo function
module.exports = connectMongo;

