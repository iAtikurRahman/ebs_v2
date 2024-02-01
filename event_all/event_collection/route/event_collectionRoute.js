const express = require('express');
const router = express.Router();
const {
  insertEventCollection,
  getAllEventCollections,
  getEventCollectionById,
  updateEventCollection,
  deleteEventCollection,
} = require('../controller/event_collectionController');

router.post('/', insertEventCollection);

router.get('/all/:id', getAllEventCollections);

router.get('/:id', getEventCollectionById);

router.patch('/:id', updateEventCollection);

router.delete('/:id', deleteEventCollection);

module.exports = router;
