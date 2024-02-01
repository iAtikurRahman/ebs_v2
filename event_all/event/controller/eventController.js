const db = require('../../../config/mysql');
const { v4: uuidv4 } = require('uuid');
const {s3} = require('../../../helper/s3')
const {decodeResults} = require('../../../helper/decodeResults')
const {insertEventQuery} = require('../query/insertEventQuery')
const {getAllEventQuery} = require('../query/getAllEventQuery')
const {getEventBylinkQuery} = require('../query/getEventBylinkQuery');
const {updateEventQuery}=require('../query/updateEventQuery')
const {getOneEventAllPostQuery} = require('../query/getOneEventAllPostQuery')
const {getEventByIdQuery,getEventMemberQuery,getEventLocationQuery,getEventCollectionQuery,getEventExpendtureQuery,getEventAttendeesQuery} = require('../query/getEventByIdQuery')
const {deleteEventMembers,deleteEventLocation,deleteEventCollection,deleteEventExpenditure,deleteEventattendees,deleteEventQ} = require('../query/deleteEventQuery')


const insertEvent = async (req, res) => {
  try {
    const { event_name, privacy, location, purpose, expected_per_person_expense, office_payment_ratio, total_expected_expenses, event_date_time, event_organizer_user_id, event_organizer_team_id, updated_by, payment_status, visibility } = req.body;
    // Retrieve the uploaded images from req.files (using multer)
    const images = req.files;
    // Ensure images is an array
    const imageArray = Array.isArray(images) ? images : [images];

    const uploadedImageURLs = [];
    try {
      for (let index = 0; index < imageArray.length; index++) {
        const imageFile = imageArray[index];
        const imageBuffer = imageFile.buffer;

        const uploadParams = {
          Bucket: 'ebs',
          Key: `imagesEbsAppEvent/${event_name}_${index + 1}_${Date.now()}.jpg`,
          Body: imageBuffer,
          ACL: 'public-read',
          ContentType: 'image/jpeg',
        };

        const s3UploadResponse = await s3.upload(uploadParams).promise();
        uploadedImageURLs.push(s3UploadResponse.Location);
      }
    } catch (error) {
      console.error('Error uploading images to S3:', error);
      res.status(500).json({ success: false, message: 'Error uploading images to S3', error: error });
      return; // Return here to prevent executing further code
    }

    // Generate a common UID for post_type and event_feed_post
    const uid = uuidv4();
    const link = uuidv4();

    // Convert the array of image URLs to a JSON string or set to null if no images
    const coverPhotoJSON = uploadedImageURLs.length > 0 ? JSON.stringify(uploadedImageURLs) : null;

    // Update the SQL query to include the cover_photo column
    await db.execute(
      insertEventQuery,
      [uid, event_name, privacy, location || null, purpose || null, expected_per_person_expense || null, office_payment_ratio || null, total_expected_expenses || null, link, event_date_time, event_organizer_user_id, event_organizer_team_id, updated_by, payment_status || 0, visibility || 0, coverPhotoJSON]
    );

    res.status(201).json({ success: true, message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Unhandled error in server:', error);
    res.status(500).json({ success: false, message: 'Unhandled error in server', error: error.message });
  }
};




const getAllEvents = async (req, res) => {
  try {
    const page = req.params.page ? parseInt(req.params.page) : 1;
    // Calculate OFFSET based on the page number and LIMIT
    const limit = 20;
    const offset = (page - 1) * limit;
    try {
      const [results] = await db.execute(getAllEventQuery,[limit,offset]);
      
      // Request/response logic
      res.status(200).json({ success: true, data: results });
      return; // Return here to prevent executing further code
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to fetch events', error: error.message });
      return; // Return here to prevent executing further code
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};


const getOneEventAllPost = async (req, res) => {
  try {
    const eventId = req.params.id;
    try {
      const [results] = await db.execute(getOneEventAllPostQuery, [eventId]);

      // Request/response logic
      res.status(200).json({ success: true, data: await decodeResults(results) });
      return; // Return here to prevent executing further code
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to fetch event post', error: error.message });
      return; // Return here to prevent executing further code
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};




const getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    try {
      const [result] = await db.execute(getEventByIdQuery, [eventId]);
      if (result.length === 0) {
        res.status(404).json({ success: false, message: 'Event not found' });
        return; // Return here to prevent executing further code
      }

      // Extract uid from the event result
      const uidValue = result[0].uid;

      // Query event_members using uid
      const [eventMembersResult] = await db.execute(getEventMemberQuery, [uidValue]);

      // Query event_location using uid
      const [eventLocationResult] = await db.execute(getEventLocationQuery, [uidValue]);

      // Query event_collection using uid
      const [eventCollectionResult] = await db.execute(getEventCollectionQuery, [uidValue]);

      // Query event_expenditure using uid
      const [eventExpenditureResult] = await db.execute(getEventExpendtureQuery, [uidValue]);

      // Query event_attendees using uid
      const [eventAttendeesResult] = await db.execute(getEventAttendeesQuery, [uidValue]);

      // Prepare the response object
      const responseData = {
        success: true,
        data: {
          event: result[0],
          eventMembers: eventMembersResult[0] || null, // If no data, set to null
          eventLocation: eventLocationResult[0] || null, // If no data, set to null
          eventCollection: eventCollectionResult[0] || null, // If no data, set to null
          eventExpenditure: eventExpenditureResult[0] || null, // If no data, set to null
          eventAttendees: eventAttendeesResult[0] || null, // If no data, set to null
        },
      };

      res.status(200).json(responseData);
      return; // Return here to prevent executing further code
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to fetch event details', error: error.message });
      return; // Return here to prevent executing further code
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};

const getEventBylink = async (req, res) => {
  try {
    const event_invited_link = req.params.id;
    try {
      const [result] = await db.execute(getEventBylinkQuery, [event_invited_link]);
      if (result.length === 0) {
        res.status(404).json({ success: false, message: 'Event not found' });
        return; // Return here to prevent executing further code
      }

      // Extract uid from the event result
      const uidValue = result[0].uid;

      // Query event_members using uid
      const [eventMembersResult] = await db.execute(getEventMemberQuery, [uidValue]);

      // Query event_location using uid
      const [eventLocationResult] = await db.execute(getEventLocationQuery, [uidValue]);

      // Query event_collection using uid
      const [eventCollectionResult] = await db.execute(getEventCollectionQuery, [uidValue]);

      // Query event_expenditure using uid
      const [eventExpenditureResult] = await db.execute(getEventExpendtureQuery, [uidValue]);

      // Query event_attendees using uid
      const [eventAttendeesResult] = await db.execute(getEventAttendeesQuery, [uidValue]);

      // Prepare the response object
      const responseData = {
        success: true,
        data: {
          event: result[0],
          eventMembers: eventMembersResult[0] || null, // If no data, set to null
          eventLocation: eventLocationResult[0] || null, // If no data, set to null
          eventCollection: eventCollectionResult[0] || null, // If no data, set to null
          eventExpenditure: eventExpenditureResult[0] || null, // If no data, set to null
          eventAttendees: eventAttendeesResult[0] || null, // If no data, set to null
        },
      };

      res.status(200).json(responseData);
      return; // Return here to prevent executing further code
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to fetch event details', error: error.message });
      return; // Return here to prevent executing further code
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};
  
  
  

const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const eventData = req.body;

    const [result] = await db.execute(getEventByIdQuery, [eventId]);
      if (result.length === 0) {
        res.status(404).json({ success: false, message: 'Event not found' });
        return; // Return here to prevent executing further code
      }

    // Exclude fields from the update data
    const {
      id,
      uid,
      event_invited_link,
      updated_at,
      ...updatedDataWithoutExcludedFields
    } = eventData;

    // Retrieve the uploaded image from req.files (using multer)
    const image = req.files && req.files[0];

    let updatedCoverPhotoURL = null;

    if (image) {
      try {

        // Upload the new cover photo to S3
        const imageBuffer = image.buffer;
        const uploadParams = {
          Bucket: 'ebs',
          Key: `imagesEbsAppEvent/${updatedDataWithoutExcludedFields.event_name}_${Date.now()}.jpg`,
          Body: imageBuffer,
          ACL: 'public-read',
          ContentType: 'image/jpeg',
        };

        const s3UploadResponse = await s3.upload(uploadParams).promise();
        updatedCoverPhotoURL = s3UploadResponse.Location;
      } catch (error) {
        res.status(500).json({ success: false, message: 'Error uploading image' });
        return; // Return here to prevent executing further code
      }
    }

    // Update the cover_photo field in the updatedDataWithoutExcludedFields
    if (updatedCoverPhotoURL) {
      updatedDataWithoutExcludedFields.cover_photo = JSON.stringify([updatedCoverPhotoURL]);
    }
    // Database update
    try {
      const [result] = await db.query(updateEventQuery, [updatedDataWithoutExcludedFields, eventId]);

      // Request/response logic
      if (result.affectedRows > 0) {
        res.status(200).json({ success: true, message: 'Event updated successfully', data: result });
        return; // Return here to prevent executing further code
      } else {
        res.status(404).json({ success: false, message: 'Event not found' });
        return; // Return here to prevent executing further code
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to update event', error: error.message });
      return; // Return here to prevent executing further code
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};


  
  

 const deleteEvent = async (req, res) => {
    try {
      const eventId = req.params.id;
  
      // Database query for event
      try {
        const [eventResult] = await db.execute(getEventByIdQuery, [eventId]);
        if (eventResult.length === 0) {
          res.status(404).json({ success: false, message: 'Event not found' });
          return;
        }
  
        const event = eventResult[0];
        const uidValue = event.uid;

        // Delete related data from event_members, event_location, event_collection, event_expenditure, and event_attendees
        await db.execute(deleteEventMembers, [uidValue]);
        await db.execute(deleteEventLocation, [uidValue]);
        await db.execute(deleteEventCollection, [uidValue]);
        await db.execute(deleteEventExpenditure, [uidValue]);
        await db.execute(deleteEventattendees, [uidValue]);
  
        // Now, delete the event itself
        await db.execute(deleteEventQ, eventId);
  
        res.status(200).json({ success: true, message: 'Event and related data deleted successfully' });
        return;
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete event and related data', error: error.message });
        return;
      }
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
    }
  };
  
  
  

module.exports = {getAllEvents,getEventById,getOneEventAllPost,getEventBylink,updateEvent,deleteEvent,insertEvent};
