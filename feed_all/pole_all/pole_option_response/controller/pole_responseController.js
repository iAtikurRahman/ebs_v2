const pole_response = require('../model/pole_response');
// CREATE a new record
const createRecord = async (req, res) => {
  try {
    const newRecord = new pole_response({
      id: 1,
      pole_id: req.body.pole_id,
      pole_option_id: req.body.pole_option_id,
      caption: req.body.caption,
      updated_by: req.body.updated_by,
    });
    const createdRecord = await newRecord.save();
    res.status(201).json(createdRecord);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// Get all records
const getAllRecords = async (req, res) => {
  try {
    const allRecords = await pole_response.find().populate('pole_id pole_option_id');
    res.status(200).json(allRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// Get records by pole ID
const getRecordsByPoleId = async (req, res) => {
  try {
    const poleId = req.params.poleId;
    const recordsList = await pole_response.find({ pole_id: poleId }).populate('pole_id pole_option_id');
    if (!recordsList || recordsList.length === 0) {
      return res.status(404).json({ error: 'Records not found' });
    }
    res.status(200).json(recordsList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// UPDATE a particular record by ID
const updateRecord = async (req, res) => {
  try {
    const recordId = req.params.recordId;
    const updatedRecord = await pole_response.findByIdAndUpdate(recordId, req.body, { new: true });
    if (!updatedRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(updatedRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// DELETE a particular record by ID
const deleteRecord = async (req, res) => {
  try {
    const recordId = req.params.recordId;
    // Delete the record
    await pole_response.findByIdAndDelete(recordId);
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
module.exports = {
  createRecord,
  getAllRecords,
  getRecordsByPoleId,
  updateRecord,
  deleteRecord,
};