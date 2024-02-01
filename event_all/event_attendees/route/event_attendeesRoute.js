const express = require('express');
const router = express.Router();
const {
  insertEventAttendee,
  getAllEventAttendees,
  getEventAttendeeById,
  updateEventAttendee,
  deleteEventAttendee,
} = require('../controller/event_attendeesController');

router.post('/', insertEventAttendee);

router.get('/all/:id', getAllEventAttendees);

router.get('/:id', getEventAttendeeById);

router.patch('/:id', updateEventAttendee);

router.delete('/:id', deleteEventAttendee);

module.exports = router;

