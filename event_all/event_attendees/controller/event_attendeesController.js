const db = require('../../../config/mysql');
const {insertAttendeesQuery}=require('../query/insertAttendeesQuery');
const {getAllAttendeesQuery}=require('../query/getAllAttendeesQuery');
const {getAttendeeByIdQuery}=require('../query/getAttendeeByIdQuery');
const {updateAttendeeQuery}=require('../query/updateAttendeeQuery');
const {deleteAttendeeQuery}=require('../query/deleteAttendeeQuery');

const insertEventAttendee = async (req, res) => {
  try {
    const eventAttendeeData = req.body;

    // Database insertion
    try {
      const [result] = await db.query(insertAttendeesQuery, [eventAttendeeData]);

      // Request/response logic
      res.status(200).json({ success: true, message: 'Event attendee created successfully', data: result });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to create event attendee', error: error.message });
      return; // Return here to prevent executing further code
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};



const getAllEventAttendees = async (req, res) => {
  try {
    const event_id = req.params.id;
    try {
      const [results] = await db.query(getAllAttendeesQuery, [event_id]);

      // Request/response logic
      res.status(200).json({ success: true, data: results });
      return; // Return here to prevent executing further code
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to fetch event attendees', error: error.message });
      return; // Return here to prevent executing further code
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};



const getEventAttendeeById = async (req, res) => {
  try {
    const eventAttendeeId = req.params.id;

    // Database query
    try {
      const [result] = await db.query(getAttendeeByIdQuery, eventAttendeeId);

      // Check if result is empty or null
      if (!result || result.length === 0) {
        res.status(404).json({ success: false, message: 'Event attendee not found' });
        return; // Return here to prevent executing further code
      }

      // Request/response logic
      res.status(200).json({ success: true, data: result[0] });
      return; // Return here to prevent executing further code
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to fetch event attendee', error: error.message });
      return; // Return here to prevent executing further code
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};



const updateEventAttendee = async (req, res) => {
  try {
    const eventAttendeeId = req.params.id;
    const eventAttendeeData = req.body;

    // Database update
    try {
      const [result] = await db.query(updateAttendeeQuery, [eventAttendeeData,eventAttendeeId]);

      // Check if no rows were affected
      if (result.affectedRows === 0) {
        res.status(404).json({ success: false, message: 'Event attendee not found for update' });
        return; 
      }

      // Request/response logic
      res.status(200).json({ success: true, message: 'Event attendee updated successfully', data: result });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to update event attendee', error: error.message });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};



const deleteEventAttendee = async (req, res) => {
  try {
    const eventAttendeeId = req.params.id;

    // Database deletion
    try {
      const [result] = await db.query(deleteAttendeeQuery, eventAttendeeId);

      // Check if no rows were affected
      if (result.affectedRows === 0) {
        res.status(404).json({ success: false, message: 'Event attendee not found for deletion' });
        return; // Return here to prevent executing further code
      }

      // Request/response logic
      res.status(200).json({ success: true, message: 'Event attendee deleted successfully', data: result });
      return; // Return here to prevent executing further code
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to delete event attendee', error: error.message });
      return; // Return here to prevent executing further code
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};



module.exports = {
  insertEventAttendee,
  getAllEventAttendees,
  getEventAttendeeById,
  updateEventAttendee,
  deleteEventAttendee,
};
