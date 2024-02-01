const express = require('express');
const router = express.Router();
const {
  insertEventExpenditure,
  getAllEventExpenditures,
  getEventExpenditureById,
  updateEventExpenditure,
  deleteEventExpenditure,
} = require('../controller/event_expenditureController');

router.post('/', insertEventExpenditure);

router.get('/all/:id', getAllEventExpenditures);

router.get('/:id', getEventExpenditureById);

router.patch('/:id', updateEventExpenditure);

router.delete('/:id', deleteEventExpenditure);

module.exports = router;

