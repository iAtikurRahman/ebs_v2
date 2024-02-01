const db = require('../../../config/mysql');
const {insertLocationQuery} = require('../query/insertLocationQuery');
const {getAllLocationQuery} = require('../query/getAllLocationQuery');
const {getLocationByIdQuery} = require('../query/getLocationByIdQuery');
const {updateLocationQuery} = require('../query/updateLocationQuery');
const {deleteLocationQuery} = require('../query/deleteLocationQuery');

const insertEventLocation = async (req, res) => {
  try {
    const eventLocationData = req.body;

    // Database insertion
    try {
      const [result] = await db.query(insertLocationQuery, eventLocationData);

      // Request/response logic
      res.status(201).json({ success: true, message: 'Event location created successfully', data: result });
      return; 
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to create event location', error: error.message });
      return; 
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};



const getAllEventLocations = async (req, res) => {
  try {
    const event_id = req.params.id;
    try {
      const [results] = await db.query(getAllLocationQuery, event_id);

      // Request/response logic
      res.status(200).json({ success: true, data: results });
      return; 
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to fetch event locations', error: error.message });
      return; 
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};



const getEventLocationById = async (req, res) => {
  try {
    const eventLocationId = req.params.id;

    // Database query
    try {
      const [result] = await db.query(getLocationByIdQuery, eventLocationId);

      // Request/response logic
      if (result.length > 0) {
        res.status(200).json({ success: true, data: result[0] });
        return; 
      } else {
        res.status(404).json({ success: false, message: 'Event location not found' });
        return; 
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to fetch event location', error: error.message });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};


const updateEventLocation = async (req, res) => {
  try {
    const eventLocationId = req.params.id;
    const eventLocationData = req.body;

    // Exclude 'event_id' from the update data
    const { event_id, ...updatedData } = eventLocationData;

    // Database update
    try {
      const [result] = await db.query(updateLocationQuery, [
        updatedData,
        eventLocationId,
      ]);

      // Request/response logic
      if (result.affectedRows > 0) {
        res.status(200).json({ success: true, message: 'Event location updated successfully', data: result });
        return; 
      } else {
        res.status(404).json({ success: false, message: 'Event location not found' });
        return; 
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to update event location', error: error.message });
      return; 
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};



const deleteEventLocation = async (req, res) => {
  try {
    const eventLocationId = req.params.id;

    // Database deletion
    try {
      const [result] = await db.query(deleteLocationQuery, eventLocationId);

      // Request/response logic
      if (result.affectedRows > 0) {
        res.status(200).json({ success: true, message: 'Event location deleted successfully', data: result });
        return; 
      } else {
        res.status(404).json({ success: false, message: 'Event location not found' });
        return; 
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to delete event location', error: error.message });
      return; 
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};


module.exports = {
  insertEventLocation,
  getAllEventLocations,
  getEventLocationById,
  updateEventLocation,
  deleteEventLocation,
};
