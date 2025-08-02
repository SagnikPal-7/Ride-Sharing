const mongoose = require('mongoose');
const captainModel = require('./models/captain.model');

// Test function to verify vehicle filtering
async function testVehicleFiltering() {
  try {
    // Connect to MongoDB (you'll need to update the connection string)
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ride-sharing');
    console.log('Connected to MongoDB');

    // Test query with vehicle type filter
    const query = {
      location: {
        $geoWithin: {
          $centerSphere: [[12.9716, 77.5946], 10 / 6371], // Bangalore coordinates, 10km radius
        },
      },
      "vehicle.vehicleType": "car"
    };

    const carCaptains = await captainModel.find(query);
    console.log(`Found ${carCaptains.length} car captains in the area`);

    // Test query for motorcycle captains
    const motoQuery = {
      location: {
        $geoWithin: {
          $centerSphere: [[12.9716, 77.5946], 10 / 6371],
        },
      },
      "vehicle.vehicleType": "motorcycle"
    };

    const motoCaptains = await captainModel.find(motoQuery);
    console.log(`Found ${motoCaptains.length} motorcycle captains in the area`);

    // Test query for auto captains
    const autoQuery = {
      location: {
        $geoWithin: {
          $centerSphere: [[12.9716, 77.5946], 10 / 6371],
        },
      },
      "vehicle.vehicleType": "auto"
    };

    const autoCaptains = await captainModel.find(autoQuery);
    console.log(`Found ${autoCaptains.length} auto captains in the area`);

    console.log('Vehicle filtering test completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testVehicleFiltering();
}

module.exports = { testVehicleFiltering }; 