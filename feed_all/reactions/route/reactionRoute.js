const router = require('express').Router();
const {
  createReaction,
    getAllReactions,
    getReactionsByPostId,
    updateReaction,
    deleteReaction,
  } = require('../controller/reactionController');

// Create a new reaction
router.post('/', createReaction);

// Get all reactions
router.get('/', getAllReactions);

// Get reactions by post ID
router.get('/:post_id', getReactionsByPostId);

// Update a particular reaction by ID
router.patch('/:reactionId', updateReaction);

// Delete a particular reaction by ID
router.delete('/:Id', deleteReaction);

module.exports = router;
