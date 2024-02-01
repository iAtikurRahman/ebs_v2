const router = require('express').Router();
const multer = require('multer');
// Multer storage configuration
const storage = multer.memoryStorage(); // Store files in memory as buffers
const upload = multer({ storage: storage });
const {
    insertWithpost_type,
    createEventFeedImage,
    getAllEventFeedImages,
    getEventFeedImagesByPostId,
    updateEventFeedImage,
    deleteEventFeedImage,
  } = require('../../controller/mongoController/event_feed_imagesController');
// ----------------------------------------------------------------------------------
// POST /api/upload_with_post_type
router.post('/upload', upload.array('images', 99), insertWithpost_type);
// Create a new event feed image
router.post('/', createEventFeedImage);
// Get all event feed images
router.get('/', getAllEventFeedImages);
// Get event feed images by post ID
router.get('/:postId', getEventFeedImagesByPostId);
// Update a particular event feed image by ID
router.patch('/:eventFeedImageId', updateEventFeedImage);
// Delete a particular event feed image by ID
router.delete('/:eventFeedImageId', deleteEventFeedImage);
module.exports = router;