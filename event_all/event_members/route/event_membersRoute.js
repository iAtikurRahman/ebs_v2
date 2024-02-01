const express = require('express');
const router = express.Router();
const {
  insertEventMember,
  getAllEventMembers,
  getEventMemberById,
  updateEventMember,
  deleteEventMember,
} = require('../controller/event_membersController');

router.post('/', insertEventMember);

router.get('/all/:id', getAllEventMembers);

router.get('/:id', getEventMemberById);

router.patch('/:id', updateEventMember);

router.delete('/:id', deleteEventMember);

module.exports = router;
