const router = require('express').Router();
const {
    createEventExpenditureMemo,
    getAllEventExpenditureMemos,
    getEventExpenditureMemosByExpenditureId,
    updateEventExpenditureMemo,
    deleteEventExpenditureMemo,
  } = require('../controller/expenditureMemosController');

// Create a new event expenditure memo
router.post('/', createEventExpenditureMemo);

// Get all one expenditure memos
router.get('/all/:id', getAllEventExpenditureMemos);

// Get event expenditure memos by expenditure ID
router.get('/:expenditureId', getEventExpenditureMemosByExpenditureId);

// Update a particular event expenditure memo by ID
router.patch('/:eventExpenditureMemoId', updateEventExpenditureMemo);

// Delete a particular event expenditure memo by ID
router.delete('/:eventExpenditureMemoId', deleteEventExpenditureMemo);

module.exports = router;
