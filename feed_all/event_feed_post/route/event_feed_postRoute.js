const express = require('express');
const router = express.Router();
const {
  getAllEventFeedPosts,
  getEventFeedPostById,
  updateEventFeedPost,
  deleteEventFeedPost,
  inserwithpost_type
} = require('../../../feed_all/event_feed_post/controller/event_feed_postController');

router.post('/insert',inserwithpost_type),

router.get('/all/:page?', getAllEventFeedPosts);

router.get('/:id', getEventFeedPostById);

router.patch('/:id', updateEventFeedPost);

router.delete('/:id', deleteEventFeedPost);

module.exports = router;

