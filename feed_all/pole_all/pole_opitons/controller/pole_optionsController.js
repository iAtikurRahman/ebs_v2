const pole_options = require('../model/pole_options');
const { v4: uuidv4 } = require('uuid');
// Generate a random string (UUID)
// CREATE a new pole option
const poleOptionCreate = async (req, res) => {
  const uid = uuidv4();
  try {
    const newPoleOption = new pole_options({
      id: 1,
      uid: uid,
      pole_id: req.body.pole_id,
      caption: req.body.caption,
      sorting_order: req.body.sorting_order || null,
      updated_by: req.body.updated_by,
    });
    const createdPoleOption = await newPoleOption.save();
    res.status(200).json(createdPoleOption);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}; 
// Get all pole options
const poleOptionAll = async (req, res) => {
  try {
    const allPoleOptions = await pole_options.find().populate('pole_id');
    res.status(200).json(allPoleOptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// Get pole options by pole ID
const poleOptionByPoleId = async (req, res) => {
  try {
    const poleUid = req.params.poleUid;
    const poleOptionsList = await pole_options.find({ pole_id: poleUid }).populate('pole_id');
    if (!poleOptionsList || poleOptionsList.length === 0) {
      return res.status(404).json({ error: 'Pole options not found' });
    }
    res.status(200).json(poleOptionsList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// UPDATE a particular pole option by ID
const poleOptionUpdate = async (req, res) => {
  try {
    const poleOptionId = req.params.poleOptionId;
    const updatedPoleOption = await pole_options.findByIdAndUpdate(poleOptionId, req.body, { new: true });
    if (!updatedPoleOption) {
      return res.status(404).json({ error: 'Pole option not found' });
    }
    res.json(updatedPoleOption);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// DELETE a particular pole option by ID
const poleOptionDelete = async (req, res) => {
  try {
    const poleOptionId = req.params.poleOptionId;
    // Delete the pole option
    await pole_options.findByIdAndDelete(poleOptionId);
    res.json({ message: 'Pole option deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
module.exports = {
  poleOptionCreate,
  poleOptionAll,
  poleOptionByPoleId,
  poleOptionUpdate,
  poleOptionDelete,
};