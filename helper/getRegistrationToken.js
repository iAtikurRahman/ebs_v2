const device_token = require('../device_token/model/device_token')

// Helper function to get FCM registration token for a user from MongoDB
const getRegistrationToken = async (userID) => {
  const deviceInfo = await device_token.findOne({ user_id: userID });
  return deviceInfo ? deviceInfo.deviceToken : null;
};

module.exports={getRegistrationToken};
