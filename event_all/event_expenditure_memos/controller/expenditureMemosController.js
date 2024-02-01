const event_expenditure_memos = require('../model/event_expenditure_memos');
const mongoose = require('mongoose');

const createEventExpenditureMemo = async (req, res) => {
  try {
    const { id, event_expenditure_id, memo_link, updated_by } = req.body;

    const newEventExpenditureMemo = new event_expenditure_memos({
      id: 1,
      event_expenditure_id: event_expenditure_id,
      memo_link: memo_link,
      updated_by: updated_by,
    });

    try {
      const createdEventExpenditureMemo = await newEventExpenditureMemo.save();

      res.status(200).json({ success: true, message: 'Event expenditure memo created successfully', data: createdEventExpenditureMemo });
      return; // Return here to prevent executing further code
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to create event expenditure memo', error: error.message });
      return; // Return here to prevent executing further code
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};


// Get all event expenditure memos
const getAllEventExpenditureMemos = async (req, res) => {
  try {
    const expenditureId = req.params.id;
    try {
      // Use populate to include details from the referenced model (assuming 'event_expenditure_id' is a reference to another model)
      const allEventExpenditureMemos = await event_expenditure_memos.find({event_expenditure_id:expenditureId});

      res.status(200).json({ success: true, data: allEventExpenditureMemos });
      return; // Return here to prevent executing further code
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to fetch event expenditure memos', error: error.message });
      return; // Return here to prevent executing further code
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};


// Get event expenditure memos by expenditure ID
const getEventExpenditureMemosByExpenditureId = async (req, res) => {
  try {
    const expenditureId = req.params.expenditureId;

    try {
      const eventExpenditureMemosList = await event_expenditure_memos.find({id: expenditureId })

      if (!eventExpenditureMemosList || eventExpenditureMemosList.length === 0) {
        res.status(404).json({ success: false, message: 'Event expenditure memos not found' });
        return; // Return here to prevent executing further code
      }

      res.status(200).json({ success: true, data: eventExpenditureMemosList });
      return; // Return here to prevent executing further code
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to fetch event expenditure memos', error: error.message });
      return; // Return here to prevent executing further code
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};


// UPDATE a particular event expenditure memo by ID
const updateEventExpenditureMemo = async (req, res) => {
  try {
    const eventExpenditureMemoId = req.params.eventExpenditureMemoId;
    const eventData = req.body;

    // Exclude fields that should not be updated (e.g., event_id)
    const { id, ...updatedData } = eventData;

    try {
      const updatedEventExpenditureMemo = await event_expenditure_memos.findOneAndUpdate(
        { id: eventExpenditureMemoId },
        updatedData,
        { new: true }
      );

      if (!updatedEventExpenditureMemo) {
        return res.status(404).json({ success: false, message: 'Event expenditure memo not found' });
      }

      return res.status(200).json({ success: true, data: updatedEventExpenditureMemo });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to update event expenditure memo', error: error.message });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};



// DELETE a particular event expenditure memo by ID
const deleteEventExpenditureMemo = async (req, res) => {
  try {
    const eventExpenditureMemoId = req.params.eventExpenditureMemoId;

    try {
      // Delete the event expenditure memo
      const deletedEventExpenditureMemo = await event_expenditure_memos.findOneAndDelete({ id: eventExpenditureMemoId });

      if (!deletedEventExpenditureMemo) {
        // If no memo was found for deletion, respond with a 404 status
        return res.status(404).json({ success: false, message: 'Event expenditure memo not found for deletion' });
      }

      // Respond with a 200 status indicating successful deletion
      return res.status(200).json({ success: true, message: 'Event expenditure memo deleted successfully' });
    } catch (error) {
      // Handle any internal server errors
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to delete event expenditure memo', error: error.message });
    }
  } catch (error) {
    // Handle invalid request errors
    console.error(error);
    return res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};




module.exports = {
  createEventExpenditureMemo,
  getAllEventExpenditureMemos,
  getEventExpenditureMemosByExpenditureId,
  updateEventExpenditureMemo,
  deleteEventExpenditureMemo,
};
