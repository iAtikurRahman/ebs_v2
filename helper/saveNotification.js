const notification = require('../notification/model/notification');

// Helper function to save notification in MongoDB
const saveNotification = async (user_id,title, response) => {
  const newNotification = new notification({
    id: 1,
    user_id,
    title,
    response,
  });
  try {
    // Save in notification 
    const savedNotification = await newNotification.save();
  } catch (error) {
    throw error; // Rethrow the error if needed
  }
};

module.exports={saveNotification};