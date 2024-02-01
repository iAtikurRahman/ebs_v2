const express = require('express');
const router = express.Router();
const multer = require('multer');
// Multer storage configuration
const storage = multer.memoryStorage(); // Store files in memory as buffers
const upload = multer({ storage: storage });
const {getAllEvents,getEventById,getOneEventAllPost,getEventBylink,updateEvent,deleteEvent,
    insertEvent} = require('../../event/controller/eventController');

router.post('/', upload.array('images', 1), insertEvent);

router.get('/all/:page?', getAllEvents);

router.get('/one/:id', getOneEventAllPost);

router.get('/:id', getEventById);

router.get('/share/:id', getEventBylink);

router.patch('/:id', upload.array('images', 1), updateEvent);

router.delete('/:id', deleteEvent);

module.exports = router;
