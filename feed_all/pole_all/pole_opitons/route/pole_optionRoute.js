const router = require("express").Router();
const {
    poleOptionCreate,
    poleOptionAll,
    poleOptionByPoleId,
    poleOptionUpdate,
    poleOptionDelete,
  } = require('../controller/pole_optionsController');
// Create a new pole option
router.post('/', poleOptionCreate);
// Get all pole options
router.get('/', poleOptionAll);
// Get pole options by pole ID
router.get('/:poleUid', poleOptionByPoleId);
// Update a particular pole option by ID
router.patch('/:poleOptionId', poleOptionUpdate);
// Delete a particular pole option by ID
router.delete('/:poleOptionId', poleOptionDelete);
module.exports = router;