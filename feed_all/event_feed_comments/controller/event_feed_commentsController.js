const mongoose = require('mongoose');
const FCM = require('fcm-node');
const db = require('../../../config/mysql');
const event_feed_comments = require('../model/event_feed_comments');
const {getRegistrationToken} = require('../../../helper/getRegistrationToken');
const {saveNotification} = require('../../../helper/saveNotification');
const {postDataQuery,eventOwnerQuery} = require('../query/insertCommentQuery');


// Initialize FCM
const serverKey = process.env.FIREBASE_SERVER_KEY;
const fcm = new FCM(serverKey);


// create a event feed comment
const createEventFeedComment = async (req, res) => {
  try {
    // Destructuring values from the request body
    const { type, post_id, parent_comment_id, caption, is_deleted, sorting_order, updated_by } = req.body;
    const [postData] = await db.query(postDataQuery,[type,post_id]);
    if (postData.length === 0) {
      res.status(400).json({ success: false, message: 'there is no post by this post id' });
      return;
    }
    const userid = postData[0].updated_by
    let results = [];
// ----------------------------------------------------------------------push notification of add member-----------------------
          const [eventOwner] = await db.query(eventOwnerQuery,[updated_by]);
          const eventOwnerName = eventOwner[0].NAME;
          const titleHere = `${eventOwnerName} commented on the post`;
          const notificationData = {
            title: titleHere,
            body: "",
            data: postData[0]
          };
          const registrationToken = await getRegistrationToken(userid);
          if (registrationToken) {
            const message = {
              to: registrationToken,
              notification: notificationData,
            };
            try {
              // Send FCM notification
              await new Promise((resolve, reject) => {
                fcm.send(message, (err, response) => {
                  if (err) {
                    let resultObj = {};
                    resultObj[userid] =  err;
                    results.push(resultObj);
                    reject(err);
                  } else {
                    resolve();
                  }
                });
              });
              
              
              // Save notification in MongoDB
              await saveNotification(userid, titleHere, postData[0]);
              let resultObj = {};
              resultObj[updated_by] = "commented successfully on the post";
              results.push(resultObj);
            } catch (error) {
              // Handle error if needed
            }
          }
          // ----------------------------------------------------------------------push notification of add member-----------------------
    // Creating a new event feed comment object
    const newEventFeedComment = new event_feed_comments({
      id: 1,
      type: type,
      post_id: post_id,
      parent_comment_id: parent_comment_id,
      caption: caption,
      is_deleted: is_deleted || false,
      sorting_order: sorting_order,
      updated_by: updated_by,
      // additional fields as needed
    });
    try {
      // Attempting to save the new comment to the database
      const createdEventFeedComment = await newEventFeedComment.save();
      // Responding with a success message and the created comment data
      res.status(201).json({ success: true, message: 'Event feed comment created successfully', data: results });
      return; // Return here to prevent executing further code
    } catch (error) {
      // Handling database-related errors
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to create event feed comment', error: error.message });
      return; // Return here to prevent executing further code
    }
  } catch (error) {
    // Handling general errors (e.g., invalid request body)
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};

// Get all event feed comments
const getAllEventFeedComments = async (req, res) => {
  try {
    const allEventFeedComments = await event_feed_comments.find().populate('type post_id');
    res.status(200).json(allEventFeedComments);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
// Get event feed comments by post_type
const getEventFeedCommentsByType = async (req, res) => {
  try {
    const post_id = req.params.post_id;
    // Fetching parent comments with parent_comment_id set to null
    const parentComments = await event_feed_comments.find({ post_id : post_id, parent_comment_id: null });
    if (!parentComments || parentComments.length === 0) {
      return res.status(404).json({ success: false, message: 'comments not found' });
    }
    // Extracting _id values of parent comments
    const parentCommentIds = parentComments.map(comment => comment._id.toString());
    // Fetching child comments with parent_comment_id set to one of the parent comment _ids
    const childComments = await event_feed_comments.find({ post_id : post_id, parent_comment_id: { $in: parentCommentIds } });
    // Merging parent and child comments
    const allComments = parentComments.map(comment => {
      const parentCommentData = comment.toObject();
      parentCommentData.children = childComments.filter(childComment => childComment.parent_comment_id.toString() === comment._id.toString());
      return parentCommentData;
    });
    // Responding with the retrieved comments
    res.status(200).json({ success: true, data: allComments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};


// get event feed comment by _id
const getEventFeedCommentsBy_id = async (req, res) => {
  try {
    // Extracting event feed comment ID from request parameters
    const eventFeedComment_id = req.params.eventFeedComment_id;
    // Validate that eventFeedComment_id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventFeedComment_id)) {
      return res.status(400).json({ success: false, message: 'Invalid comment ID format' });
    }
    // Fetching parent comments with the specified eventFeedComment_id
    const parentComments = await event_feed_comments.find({ _id: eventFeedComment_id });
    // Check if the parent comment exists
    if (!parentComments || parentComments.length === 0) {
      return res.status(404).json({ success: false, message: 'Parent comment not found' });
    }
    // Assuming there is only one parent comment with the given ID
    const parentComment = parentComments[0];
    // Fetching child comments based on parent_comment_id
    const childComments = await event_feed_comments.find({ parent_comment_id: parentComment._id });
    const data = {
      parentComment: parentComments,
      childComments: childComments || null
    };
    // Responding with the retrieved comments
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

// UPDATE a particular event feed comment by ID
const updateEventFeedComment = async (req, res) => {
  try {
    // Extracting event feed comment ID from request parameters
    const eventFeedCommentId = req.params.eventFeedCommentId;
    // Updating the event feed comment by ID with the request body and getting the updated document
    const updatedEventFeedComment = await event_feed_comments.findByIdAndUpdate(
      eventFeedCommentId,
      req.body,
      { new: true }
    );
    // Checking if the comment was found and updated
    if (!updatedEventFeedComment) {
      return res.status(404).json({ success: false, message: 'Event feed comment not found' });
    }
    // Responding with the updated comment
    res.status(200).json({ success: true, data: updatedEventFeedComment });
  } catch (error) {
    // Handling errors, both general and server-related
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};
// DELETE a particular event feed comment by ID
const deleteEventFeedComment = async (req, res) => {
  try {
    const eventFeedComment_id = req.params.eventFeedCommentId;
    // Validate that eventFeedComment_id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventFeedComment_id)) {
      return res.status(400).json({ success: false, message: 'Invalid comment ID format' });
    }
    // Fetching parent comments with the specified eventFeedComment_id
    const parentComments = await event_feed_comments.find({ _id: eventFeedComment_id });
    // Check if the parent comment exists
    if (!parentComments || parentComments.length === 0) {
      return res.status(404).json({ success: false, message: 'comment not found' });
    }
    // Assuming there is only one parent comment with the given ID
    const parentComment = parentComments[0];
    await event_feed_comments.deleteMany({parent_comment_id:parentComment._id})
    // Delete the event feed comment
    await event_feed_comments.findByIdAndDelete(eventFeedComment_id);
    res.status(200).json({success: true, message: 'Event feed comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, error: 'Internal Server Error' });
  }
};
module.exports = {
  createEventFeedComment,
  getAllEventFeedComments,
  getEventFeedCommentsByType,
  getEventFeedCommentsBy_id,
  updateEventFeedComment,
  deleteEventFeedComment,
};