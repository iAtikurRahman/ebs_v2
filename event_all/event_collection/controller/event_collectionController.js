const db = require('../../../config/mysql');
const {insertCollectionQuery}=require('../query/insertCollectionQuery')
const {getAllCollectionQuery}=require('../query/getAllCollectionQuery')
const {getCollectionByIdQuery}=require('../query/getCollectionByIdQuery')
const {updateCollectionQuery}=require('../query/updateCollectionQuery')
const {deleteCollectionQuery}=require('../query/deleteCollectionQuery')

const insertEventCollection = async (req, res) => {
  try {
    const eventCollectionData = req.body;

    // Database insertion
    try {
      const [result] = await db.query(insertCollectionQuery, [eventCollectionData]);

      // Request/response logic
      res.status(201).json({ success: true, message: 'Event collection created successfully', data: result });
      return; // Return here to prevent executing further code
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to create event collection', error: error.message });
      return; // Return here to prevent executing further code
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};


const getAllEventCollections = async (req, res) => {
  try {
    const event_id = req.params.id;
    try {
      const [results] = await db.query(getAllCollectionQuery, [event_id]);

      // Request/response logic
      res.status(200).json({ success: true, data: results });
      return; // Return here to prevent executing further code
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to fetch event collections', error: error.message });
      return; // Return here to prevent executing further code
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};


const getEventCollectionById = async (req, res) => {
  try {
    const eventCollectionId = req.params.id;

    // Database query
    try {
      const [result] = await db.query(getCollectionByIdQuery, eventCollectionId);

      // Check if result is empty or null
      if (!result || result.length === 0) {
        res.status(404).json({ success: false, message: 'Event collection not found' });
        return; // Return here to prevent executing further code
      }

      // Request/response logic
      res.status(200).json({ success: true, data: result[0] });
      return; // Return here to prevent executing further code
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to fetch event collection', error: error.message });
      return; // Return here to prevent executing further code
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};


const updateEventCollection = async (req, res) => {
  try {
    const eventCollectionId = req.params.id;
    const eventCollectionData = req.body;

    // Exclude 'event_id' from the update data
    const { event_id, ...updatedData } = eventCollectionData;

    // Database update
    try {
      const [result] = await db.query(updateCollectionQuery, [updatedData,eventCollectionId]);

      // Check if result is empty or null
      if (result.affectedRows === 0) {
        res.status(404).json({ success: false, message: 'Event collection not found for update' });
        return; // Return here to prevent executing further code
      }

      // Request/response logic
      res.status(200).json({ success: true, message: 'Event collection updated successfully', data: result });
      return; // Return here to prevent executing further code
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to update event collection', error: error.message });
      return; // Return here to prevent executing further code
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};


const deleteEventCollection = async (req, res) => {
  try {
    const eventCollectionId = req.params.id;

    // Database deletion
    try {
      const [result] = await db.query(deleteCollectionQuery, eventCollectionId);

      // Check if result is empty or null
      if (result.affectedRows === 0) {
        res.status(404).json({ success: false, message: 'Event collection not found for deletion' });
        return; // Return here to prevent executing further code
      }

      // Request/response logic
      res.status(200).json({ success: true, message: 'Event collection deleted successfully', data: result });
      return; // Return here to prevent executing further code
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to delete event collection', error: error.message });
      return; // Return here to prevent executing further code
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};


module.exports = {
  insertEventCollection,
  getAllEventCollections,
  getEventCollectionById,
  updateEventCollection,
  deleteEventCollection,
};
