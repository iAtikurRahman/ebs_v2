require("dotenv").config();
const FCM = require('fcm-node');
const db = require('../../../config/mysql');
const {getRegistrationToken} = require('../../../helper/getRegistrationToken');
const {saveNotification} = require('../../../helper/saveNotification');
const {eventQuery,existingMemberQuery,eventOwnerQuery,insertMemberQuery}=require('../query/insertMemberQuery');
const {getAllMembersQuery}=require('../query/getAllMembersQuery');
const {getMemberByIdQuery}=require('../query/getMemberByIdQuery');
const {updateMemberQuery}=require('../query/updateMemberQuery');
const {deleteMemberQuery}=require('../query/deleteMemberQuery');

// Initialize FCM
const serverKey = process.env.FIREBASE_SERVER_KEY;
const fcm = new FCM(serverKey);



// add members in a event
const insertEventMember = async (req, res) => {
  try {
    const { user_id, event_id, access_role, is_approved, is_invited, approved_by, updated_by } = req.body;

    // Validate input fields
    const [existingEvent] = await db.query(eventQuery, [event_id]);

    if(existingEvent.length==0){
      res.status(400).json({ success: false, message: 'there is no event by this event id' });
      return;
    }
    if (!Array.isArray(user_id) || !event_id || !access_role) {
      res.status(400).json({ success: false, message: 'user_id have to be an array' });
      return;
    }
    // Assuming the results array 
    let results = [];

    for (const userid of user_id) {
      try {
        const [existingMember] = await db.query(existingMemberQuery, [event_id, userid]);
        // Check if there is an existing member for the current user
        if (existingMember.length > 0) {
          let resultObj = {};
          resultObj[userid] = `is already a ${access_role}`;
          results.push(resultObj);

          continue;
        }
        // Check if there is no existing member for any user
        if (!existingMember[0]) {

          // ----------------------------------------------------------------------push notification of add member-----------------------

          const [eventOwner] = await db.query(eventOwnerQuery,[updated_by]);
          const eventOwnerName = eventOwner[0].NAME;
          const titleHere = `${eventOwnerName} added you in an event as ${access_role}`;
          const notificationData = {
            title: titleHere,
            body: "",
            data: existingEvent[0]
          };
          const registrationToken = await getRegistrationToken(userid);
          if (registrationToken) {
            const message = {
              to: registrationToken,
              notification: notificationData,
            };


            // insert this member in mysql 
            const [resultOfInsertMember] = await db.query(insertMemberQuery, [userid, event_id, access_role, is_approved || 0, is_invited || 0, approved_by || null, updated_by || null]);
            // Save notification in MongoDB
            await saveNotification(userid, titleHere, existingEvent[0]);
            let resultObj = {};
            resultObj[userid] = `added as ${access_role}`;
            results.push(resultObj);

            try {
              // Send FCM notification
              await new Promise((resolve, reject) => {
                fcm.send(message, (err, response) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve();
                  }
                });
              });

              
            } catch (error) {

            }
          }

          // ----------------------------------------------------------------------push notification of add member-----------------------
          
        }
      } catch (error) {

      }
    }

    // Request/response logic
    res.status(200).json({ message: 'Event members created successfully', data: results });
    return;
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error: error.message });
  }
};

const getAllEventMembers = async (req, res) => {
  try {
    const eventId = req.params.id;
    try {
      const [results] = await db.query(getAllMembersQuery, eventId);
      // Request/response logic
      res.status(200).json({ success: true, data: results });
      return; // Return here to prevent executing further code
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to fetch event members', error: error.message });
      return; // Return here to prevent executing further code
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};

const getEventMemberById = async (req, res) => {
  try {
    const eventMemberId = req.params.id;
    // Database query
    try {
      const [result] = await db.query(getMemberByIdQuery, [eventMemberId]);
      // Check if result is empty or null
      if (!result || result.length === 0) {
        res.status(404).json({ success: false, message: 'Event member not found' });
        return; // Return here to prevent executing further code
      }
      // Request/response logic
      res.status(200).json({ success: true, data: result[0] });
      return; // Return here to prevent executing further code
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to fetch event member', error: error.message });
      return; // Return here to prevent executing further code
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};

const updateEventMember = async (req, res) => {
  try {
    const eventMemberId = req.params.id;
    const eventMemberData = req.body;
    // Exclude 'event_id' from the update data
    const { event_id, ...updatedData } = eventMemberData;
    // Database update
    try {
      const [result] = await db.query(updateMemberQuery, [
        updatedData,
        eventMemberId,
      ]);
      // Check if no rows were affected
      if (result.affectedRows === 0) {
        res.status(404).json({ success: false, message: 'Event member not found for update' });
        return; // Return here to prevent executing further code
      }
      // Request/response logic
      res.status(200).json({ success: true, message: 'Event member updated successfully', data: result });
      return; // Return here to prevent executing further code
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to update event member', error: error.message });
      return; // Return here to prevent executing further code
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};
const deleteEventMember = async (req, res) => {
  try {
    const eventMemberId = req.params.id;
    // Database deletion
    try {
      const [result] = await db.query(deleteMemberQuery, eventMemberId);
      // Check if no rows were affected
      if (result.affectedRows === 0) {
        res.status(404).json({ success: false, message: 'Event member not found for deletion' });
        return; // Return here to prevent executing further code
      }
      // Request/response logic
      res.status(200).json({ success: true, message: 'Event member deleted successfully', data: result });
      return; // Return here to prevent executing further code
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to delete event member', error: error.message });
      return; // Return here to prevent executing further code
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};
module.exports = {
  insertEventMember,
  getAllEventMembers,
  getEventMemberById,
  updateEventMember,
  deleteEventMember,
};