const router = require('express').Router();
const {
    createEventFeedComment,
    getAllEventFeedComments,
    getEventFeedCommentsByType,
    getEventFeedCommentsBy_id,
    updateEventFeedComment,
    deleteEventFeedComment,
  } = require('../controller/event_feed_commentsController');
// Create a new event feed comment
router.post('/', createEventFeedComment);
// Get all event feed comments
router.get('/', getAllEventFeedComments);
// Get event feed comments by post ID
router.get('/all/:post_id', getEventFeedCommentsByType);
// get event feed comments by _id
router.get('/:eventFeedComment_id', getEventFeedCommentsBy_id);
// Update a particular event feed comment by ID
router.patch('/:eventFeedCommentId', updateEventFeedComment);
// Delete a particular event feed comment by ID
router.delete('/:eventFeedCommentId', deleteEventFeedComment);
module.exports = router;
