const { v4: uuidv4 } = require('uuid');
const db = require('../../../config/mysql');
const event_feed_comments= require('../../../feed_all/event_feed_comments/model/event_feed_comments')
const reactions= require('../../../feed_all/reactions/model/reaction')
const pole = require('../../../feed_all/pole_all/pole/model/pole');
const form = require('../../../feed_all/form_all/form/model/form');
const {decodeResults}= require('../../../helper/decodeResults');
const {decodeReactionList}= require('../../../helper/decodeReactionList');
const {insertPostTypeQuery,insertFeedPostQuery} = require('../query/insertPostQuery');
const {getAllPostQuery,getReactionList} = require('../query/getAllPostQuery');
const {getOnePostQuery,gerOnePostType,gerOneEvent} = require('../query/getPostQuery');
const {updatePostType,updatePost} = require('../query/updatePostQuery');
const {deletePost_type,deletePost} = require('../query/deletePostQuery');



// ---------------------------------------------------------------------------------------------------------------------------------
const inserwithpost_type = async (req, res) => {
  try {
    const { caption, post_desc, feed_sharing, event_id, updated_by } = req.body;

    // Generate a common UID for both tables
    const uid = uuidv4();
    const uid1 = uuidv4();

    // Insert into post_type
    await db.execute(insertPostTypeQuery, [
      uid,
      caption || null,
      updated_by,
      new Date(),
    ]);
    // Insert into event

    // Insert into event_feed_post
    await db.execute(
      insertFeedPostQuery,
      [uid1, uid, event_id || null, post_desc || null, feed_sharing, 0, updated_by, new Date()]
    );

    res.status(200).json({ success: true, message: 'Data inserted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error });
  }
};





const getAllEventFeedPosts = async (req, res) => {
  try {
    const page = req.params.page ? parseInt(req.params.page) : 1;
    // Calculate OFFSET based on the page number and LIMIT
    const limit = 30;
    const offset = (page - 1) * limit;
    try {
      const [results] = await db.execute(getAllPostQuery, [limit,offset]
                            );


      // Decode base64 caption and replace it in the results
      const decodedResults = await decodeResults(results);

      let data = [];
      for (const oneResult of decodedResults) {
        const post_id = oneResult.uid;
        const poleResult = await pole.findOne({ post_id: post_id });
        const formResult = await form.findOne({ post_id: post_id });
        // Step 04: Query MongoDB collections
        let reactionWithList = [];
        const commentsMongo = await event_feed_comments.find({ post_id: post_id ,parent_comment_id: null });
        const reactionsList = await reactions.find({ post_id: post_id });
        if (!reactionsList || reactionsList.length === 0) {
          reactionWithList.push();
        };
      //have to add reaction_list data from mysql table
      for (const reaction of reactionsList) {
        const [results] = await db.query(getReactionList,[reaction.reaction_id]);
        const mysqlresult = await decodeReactionList(results);
        const sqlresult = mysqlresult[0];
  
        reactionWithList.push({
          _id: reaction._id,
          id: reaction.id,
          type: reaction.type,
          post_id: reaction.post_id,
          is_deleted: reaction.is_deleted,
          reaction_color: reaction.reaction_color,
          updated_by: reaction.updated_by,
          reaction_id:reaction.reaction_id,
          ...sqlresult
        })
      }
        
        data.push({
          post: oneResult,
          poleData: poleResult || null,
          formData: formResult || null,
          comments: commentsMongo,
          reactions:reactionWithList
        });
      }
      

      // Request/response logic
      res.status(200).json({ data: data });
      return;
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch event feed posts', error: error.message });
      return;
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error: error.message });
  }
};



const getEventFeedPostById = async (req, res) => {
  try {
    const eventFeedPostId = req.params.id;

    // Database query for event_feed_post
    try {
      const [eventFeedPostResult] = await db.query(getOnePostQuery, eventFeedPostId);
      if (eventFeedPostResult.length === 0) {
        res.status(404).json({ success: false, message: 'Event Feed Post not found' });
        return; // Return here to prevent executing further code
      }

      const eventFeedPost = eventFeedPostResult[0];

      // MongoDB queries for comments and reactions
      const [postType] = await db.query(gerOnePostType, eventFeedPost.type);

      let [event] = [0];
      if(eventFeedPost.event_id!==null){
        [event] = await db.query(gerOneEvent,eventFeedPost.event_id)
      }

      let reactionWithList = [];
      const commentsM = await event_feed_comments.find({ post_id: eventFeedPost.uid, parent_comment_id: null });
      const reactionsList = await reactions.find({ post_id: eventFeedPost.uid });
      const poleResult = await pole.findOne({ post_id: eventFeedPost.uid });
      const formResult = await form.findOne({ post_id: eventFeedPost.uid });
       
      if (!reactionsList || reactionsList.length === 0) {
        reactionWithList.push();
      };
      
      for (const reaction of reactionsList) {
        const [results] = await db.query(getReactionList,[reaction.reaction_id]);
        const mysqlresult = await decodeReactionList(results);
        const sqlresult = mysqlresult[0];
  
        reactionWithList.push({
          _id: reaction._id,
          id: reaction.id,
          type: reaction.type,
          post_id: reaction.post_id,
          is_deleted: reaction.is_deleted,
          reaction_color: reaction.reaction_color,
          updated_by: reaction.updated_by,
          reaction_id:reaction.reaction_id,
          ...sqlresult
        })
      }
      

      // Prepare the response object
      const responseData = {
        success: true,
        data: {
          post_type: await decodeResults(postType),
          eventFeedPost,
          event:event[0] ||null,
          poleData:poleResult||null,
          formData:formResult||null,
          comments: commentsM || null,
          reactions: reactionWithList || null
        },
      };

      res.status(200).json(responseData);
      return; // Return here to prevent executing further code
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to fetch event feed post and related data', error: error.message });
      return; // Return here to prevent executing further code
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};





const updateEventFeedPost = async (req, res) => {
  try {
    const eventFeedPostId = req.params.id;
    const eventFeedPostData = req.body;

    const { uid, type, event_id, caption, ...updatedData } = eventFeedPostData;

    // Database update
    try {
      await db.query(updatePostType,[caption,eventFeedPostId]);

      const [result] = await db.query(updatePost, [
        updatedData,
        eventFeedPostId,
      ]);

      // Request/response logic
      res.status(200).json({ message: 'Event feed post updated successfully', data: result });
      return;
    } catch (error) {
      res.status(500).json({ message: 'Failed to update event feed post', error: error.message });
      return;
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error: error.message });
  }
};


const deleteEventFeedPost = async (req, res) => {
  try {
    const eventFeedPostId = req.params.id;

    // Database query for event_feed_post
    try {
      const [eventFeedPostResult] = await db.query(getOnePostQuery, eventFeedPostId);
      if (eventFeedPostResult.length === 0) {
        res.status(404).json({ success: false, message: 'Event Feed Post not found' });
        return;
      }

      const eventFeedPost = eventFeedPostResult[0];

      // delete post_type of this post
      await db.query(deletePost_type, eventFeedPost.type);


      // Delete event_feed_comments and reactions based on post_id (uid)
      await event_feed_comments.deleteMany({ post_id: eventFeedPost.uid });
      await reactions.deleteMany({ post_id: eventFeedPost.uid });

      // Now, delete the event_feed_post
      await db.query(deletePost, eventFeedPostId);

      res.status(200).json({ success: true, message: 'Event Feed Post and related data deleted successfully' });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to delete event feed post and related data', error: error.message });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request', error: error.message });
  }
};




module.exports = {
  getAllEventFeedPosts,
  getEventFeedPostById,
  updateEventFeedPost,
  deleteEventFeedPost,
  inserwithpost_type
};
