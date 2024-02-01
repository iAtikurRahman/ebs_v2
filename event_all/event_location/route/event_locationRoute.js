const express = require('express');
const router = express.Router();
const {
  insertEventLocation,
  getAllEventLocations,
  getEventLocationById,
  updateEventLocation,
  deleteEventLocation,
} = require('../controller/event_locationController');

router.post('/', insertEventLocation);

router.get('/all/:id', getAllEventLocations);

router.get('/:id', getEventLocationById);

router.patch('/:id', updateEventLocation);

router.delete('/:id', deleteEventLocation);

module.exports = router;
