const db = require('../../../config/mysql');
const event_expenditure_memos = require('../../event_expenditure_memos/model/event_expenditure_memos')
const { v4: uuidv4 } = require('uuid');
const {insertExpenditureQuery} = require('../query/insertExpenditureQuery');
const {getAllExpenditureQuery} = require('../query/getAllExpenditureQuery');
const {getExpenditureByIdQuery} = require('../query/getExpenditureByIdQuery');
const {updateExpenditureQuery} = require('../query/updateExpenditureQuery');
const {deleteExpenditureQuery} = require('../query/deleteExpenditureQuery');


const insertEventExpenditure = async (req, res) => {
  try {
    const { event_id, expenditure_cause, expenditure_amount, user_id , updated_by} = req.body;
    const uid = uuidv4();

    // Database insertion
    try {
      const [result] = await db.query(insertExpenditureQuery, [
        uid,
        event_id,
        expenditure_cause ||null,
        expenditure_amount ||null,
        user_id || null,
        updated_by || null
      ]);

      // Request/response logic
      res.status(201).json({ success: true, message: 'Event expenditure created successfully', data: result });
      return; 
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to create event expenditure', error: error.message });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};


const getAllEventExpenditures = async (req, res) => {
  try {
    const eventId = req.params.id;
    try {
      const [results] = await db.query(getAllExpenditureQuery, eventId );

      // Request/response logic
      res.status(200).json({ success: true, data: results });
      return; 
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to fetch event expenditures', error: error.message });
      return; 
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};


const getEventExpenditureById = async (req, res) => {
  try {
    const eventExpenditureId = req.params.id;

    // Database query
    try {
      const [result] = await db.query(getExpenditureByIdQuery, eventExpenditureId);
      if (result.length === 0) {
        res.status(404).json({ success: false, message: 'Event expenditure not found' });
        return; 
      }

      // Extract uid from the event result
      const uidValue = result[0].uid;

      const expenditureMemosResult = await event_expenditure_memos.find({ event_expenditure_id: uidValue });

      // Request/response logic
      const responseData = {
        success: true,
        data: {
          event: result[0],
          expenditureMemos: expenditureMemosResult || null, // If no data, set to null
        },
      };
      res.status(200).json(responseData);
      return; 
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to fetch event expenditure', error: error.message });
      return; 
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};


const updateEventExpenditure = async (req, res) => {
  try {
    const eventExpenditureId = req.params.id;
    const eventExpenditureData = req.body;

    // Exclude 'event_id' from the update data
    const { event_id, ...updatedData } = eventExpenditureData;

    // Database update
    try {
      const [result] = await db.query(updateExpenditureQuery, [
        updatedData,
        eventExpenditureId,
      ]);

      if (result.affectedRows === 0) {
        res.status(404).json({ success: false, message: 'Event expenditure not found for update' });
        return;
      }

      // Request/response logic
      res.status(200).json({ success: true, message: 'Event expenditure updated successfully', data: result });
      return; 
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to update event expenditure', error: error.message });
      return; 
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};


const deleteEventExpenditure = async (req, res) => {
  try {
    const eventExpenditureId = req.params.id;

    // Database deletion
    try {
      const [result] = await db.query(deleteExpenditureQuery, eventExpenditureId);

      if (result.affectedRows === 0) {
        res.status(404).json({ success: false, message: 'Event expenditure not found for deletion' });
        return; 
      }

      // Request/response logic
      res.status(200).json({ success: true, message: 'Event expenditure deleted successfully', data: result });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to delete event expenditure', error: error.message });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};


module.exports = {
  insertEventExpenditure,
  getAllEventExpenditures,
  getEventExpenditureById,
  updateEventExpenditure,
  deleteEventExpenditure,
};
