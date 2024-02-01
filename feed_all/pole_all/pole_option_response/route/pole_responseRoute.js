const router = require('express').Router();
const {
    createRecord,
    getAllRecords,
    getRecordsByPoleId,
    updateRecord,
    deleteRecord,
  } = require('../controller/pole_responseController');
// Create a new record
router.post('/', createRecord);
// Get all records
router.get('/', getAllRecords);
// Get records by pole ID
router.get('/:poleId', getRecordsByPoleId);
// Update a particular record by ID
router.put('/:recordId', updateRecord);
// Delete a particular record by ID
router.delete('/:recordId', deleteRecord);
module.exports = router;