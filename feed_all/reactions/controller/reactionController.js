const { v4: uuidv4 } = require('uuid');
const FCM = require('fcm-node');
const db = require('../../../config/mysql');
const reactions = require('../model/reaction');
const {getRegistrationToken}=require('../../../helper/getRegistrationToken');
const {saveNotification}=require('../../../helper/saveNotification');
const {decodeReactionList}=require('../../../helper/decodeReactionList');
const {selectPostQuery,updateReactionList,reactorQuery,insertReactionList} = require('../query/insertReaction');
const {reactionListQuery} = require('../query/getReactionByPostId');


// Initialize FCM
const serverKey = process.env.FIREBASE_SERVER_KEY;
const fcm = new FCM(serverKey);


// create a new reaction
const createReaction = async (req, res) => {
  try {
    const { type, post_id, reaction_color, reaction_name, reaction_icon, updated_by, is_deleted } = req.body;

    // Check if the post exists
    const [postData] = await db.query(selectPostQuery, [type, post_id]);
    if (postData.length === 0) {
      return res.status(400).json({ success: false, message: 'There is no post with this ID.' });
    }

    // Check if there's an existing reaction for the given post and user
    const existingReaction = await reactions.findOne({ type, post_id, updated_by });

    if (existingReaction) {
      // Update existing reaction
      existingReaction.reaction_color = reaction_color;
      existingReaction.updated_by = updated_by;
      existingReaction.is_deleted = is_deleted || false;

      // Update reaction data in the database
      await db.execute(updateReactionList, [
        reaction_color, reaction_name, reaction_icon, existingReaction.reaction_id
      ]);

      // Save the updated reaction
      await existingReaction.save();

      return res.status(200).json({
        success: true,
        message: 'Event feed reaction updated successfully',
        data: { [updated_by]: 'Reacted successfully on the post' }
      });
    } else {
      // Create a new reaction
      const uid = uuidv4();

      // Push notification for the reaction
      const [reactor] = await db.query(reactorQuery, [updated_by]);
      const reactorName = reactor[0].NAME;
      const titleHere = `${reactorName} reacted on the post`;
      const notificationData = {
        title: titleHere,
        body: '',
        data: postData[0]
      };
      const registrationToken = await getRegistrationToken(postData[0].updated_by);

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
                reject(err);
              } else {
                resolve();
              }
            });
          });

          // Save notification in MongoDB
          await saveNotification(postData[0].updated_by, titleHere, postData[0]);
        } catch (error) {
          console.error('Error sending FCM notification:', error);
          // Handle error if needed
        }
      }

      // Insert new reaction into the database
      await db.execute(insertReactionList, [
        uid, reaction_color || null, reaction_name || null, reaction_icon || null, updated_by, new Date(),
      ]);

      // Create a new reaction object
      const newReaction = new reactions({
        id: 1,
        type,
        post_id,
        reaction_id: uid,
        is_deleted: is_deleted || false,
        reaction_color,
        updated_by,
      });

      // Save the new reaction
      await newReaction.save();

      return res.status(200).json({
        success: true,
        message: 'Event feed reaction created successfully',
        data: { [updated_by]: 'Reacted successfully on the post' }
      });
    }
  } catch (error) {
    console.error('Error in createReaction:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error });
  }
};




// Get all reactions
const getAllReactions = async (req, res) => {
  try {
    const allReactions = await reactions.find().populate('post_id reaction_id');
    res.status(200).json(allReactions);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get reactions by post ID
const getReactionsByPostId = async (req, res) => {
  try {
    const postId = req.params.post_id;
    let reactionWithList = [];
    const reactionsList = await reactions.find({ post_id : postId })
    
    if (!reactionsList || reactionsList.length === 0) {
      return res.status(404).json({ error: 'Reactions not found' });
    };
    
    for (const reaction of reactionsList) {
      const [results] = await db.query(reactionListQuery,[reaction.reaction_id]);
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

    

    res.status(200).json(reactionWithList);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

// UPDATE a particular reaction by ID
const updateReaction = async (req, res) => {
  try {
    const reactionId = req.params.reactionId;
    const updatedReaction = await reactions.findByIdAndUpdate(reactionId, req.body, { new: true });

    if (!updatedReaction) {
      return res.status(404).json({ error: 'Reaction not found' });
    }

    res.json(updatedReaction);
    return;
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// DELETE a particular reaction by ID
const deleteReaction = async (req, res) => {
  try {
    const reactionId = req.params.reactionId;

    // Delete the reaction
    await reactions.findByIdAndDelete(reactionId);

    res.json({ message: 'Reaction deleted successfully' });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

module.exports = {
  createReaction,
  getAllReactions,
  getReactionsByPostId,
  updateReaction,
  deleteReaction,
};
