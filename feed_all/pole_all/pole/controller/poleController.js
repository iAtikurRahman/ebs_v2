const { v4: uuidv4 } = require('uuid');
const db = require('../../../../config/mysql');
const pole = require('../model/pole');
const pole_options = require('../../pole_opitons/model/pole_options');
const pole_response = require('../../pole_option_response/model/pole_response');
const {insertPostTypeQuery,insertFeedPostQuery}=require('../query/insertPole');
const {userInfo}=require('../query/getAllPole');
const {updatePostTypeQuery,updatePostQuery}=require('../query/updatePole');
const {deletePostTypeQuery,deletePostQuery}=require('../query/deletePole');



// Generate a random string (UUID)
const uid1 = uuidv4();

// -------------------------------------------------------------------------------------------------------
const insertWithpost_type = async (req, res) => {
  try {
    const { caption, updated_by, event_id,post_desc, sorting_order,feed_sharing, is_deleted } = req.body;

    // Generate a common UID for post_type and event_feed_post
    const uid = uuidv4();
    const uid1 = uuidv4();
    const uid2 = uuidv4();

    // Insert into post_type
    await db.execute(insertPostTypeQuery, [
      uid,
      caption || null,
      updated_by,
      new Date(),
    ]);
    // Insert into event_feed_post
    await db.execute(
      insertFeedPostQuery,
      [uid1, uid, event_id || null, post_desc || null, feed_sharing||null, 0, updated_by, new Date()]
    );

    const newPole = new pole({
      id: 1, // predefined auto increment
      uid: uid2, 
      type: uid, // its the uid of post_type
      post_id: uid1, // it the post uid
      caption: caption,
      sorting_order: sorting_order || null,
      is_deleted: is_deleted || false,
      updated_by: updated_by
      // additional fields as needed
    });

    try {
      // Save the new pole to the database
      const createdPole = await newPole.save();

      // Send success response after both insertions
      res.status(200).json({ success: true, message: 'Pole inserted successfully', data: createdPole });
      return; // Return here to prevent executing further code
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return; // Return here to prevent executing further code
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};





// Define a route to create a new pole
const poleCreate = async (req, res) => {
    try {
      // Create a new pole instance with data from the request body
      const newPole = new pole({
        id: req.body.id,
        uid: uid1,
        type: req.body.type,
        post_id: req.body.post_id,
        caption: req.body.caption,
        sorting_order: req.body.sorting_order,
        is_deleted: req.body.is_deleted || false,
        updated_by: req.body.updated_by,
        // additional fields as needed
      });
  
      // Save the new pole to the database
      const createdPole = await newPole.save();
  
      res.status(201).json(createdPole);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

// Define a route to get all data for all poles add mysql users table "updated_by" info name and user_pic
const poleAll = async (req, res) => {
  try {
    // Fetch all poles along with their related options and responses
    const allPoles = await pole.find();
    let allPolesData = [];

    for (const pole of allPoles) {
      try {
        const poleOne = await db.execute(userInfo, [pole.updated_by]);
        // Assuming the query returns a single result, you may need to adjust if it can return multiple rows.
        const userData = poleOne[0];
        const data = userData[0] || {};
        // Add the data to the result array
        allPolesData.push({
          _id:pole._id,
          id: pole.id,
          uid: pole.uid,
          type: pole.type,
          post_id: pole.post_id,
          caption: pole.caption,
          sorting_order: pole.sorting_order,
          is_deleted: pole.is_deleted,
          updated_by: pole.updated_by,
          user_name: data.fullName || null,
          user_pic: data.user_pic || null
        });
      } catch (error) {
        console.error('Error in fetching user data:', error);
      }
    }

    res.json(allPolesData);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Define a route to get data for a particular pole by ID
const poleOne = async (req, res) => {
  try {
    const id = req.params.id;
    let poleData = [];
    try {
      const records = await pole.find({ id: id });
      if (!records || records.length === 0) {
        return res.status(404).json({success: false, message:'poll not found' });
      }
      const poleid = records[0].uid;
      const poleOneData = records[0];
      const poleOption = await pole_options.find({ pole_id: poleid }).exec();
      const poleOptionsResponse = await pole_response.find({ pole_id: poleid }).exec();
      const userOne = await db.execute(userInfo, [records[0].updated_by]);
        // the user one data are from users table
        const userData = userOne[0];
        const data = userData[0] || {};
        // Add the data to the result array
        poleData.push({
          _id:poleOneData._id,
          id: poleOneData.id,
          uid: poleOneData.uid,
          type: poleOneData.type,
          post_id: poleOneData.post_id,
          caption: poleOneData.caption,
          sorting_order: poleOneData.sorting_order,
          is_deleted: poleOneData.is_deleted,
          updated_by: poleOneData.updated_by,
          user_name: data.fullName || null,
          user_pic: data.user_pic || null
        });

      // Construct the response object with records, formOption, and formOptionRespose
      const response = {
        pole: poleData,
        poleOptionBody: [],
      };

      // Use for loop to iterate through formOption and match with formOptionsResponse based on uid
      for (let i = 0; i < poleOption.length; i++) {
        const option = poleOption[i];
        const matchingResponses = [];

        // Use another for loop to find matching responses
        for (let j = 0; j < poleOptionsResponse.length; j++) {
          const responseItem = poleOptionsResponse[j];
          if (responseItem.pole_option_id === option.uid) {
            const result = await db.execute(
              userInfo,
              [responseItem.updated_by]);
            const data = result[0];
            matchingResponses.push({
              _id: responseItem._id,
              id: responseItem.id,
              pole_id: responseItem.pole_id,
              pole_option_id: responseItem.pole_option_id,
              caption: responseItem.caption,
              updated_by: responseItem.updated_by,
              name: data[0].fullName || null,
              pic: data[0].user_pic || null,
              updated_at: responseItem.updated_at,
              createdAt: responseItem.createdAt,
              updatedAt: responseItem.updatedAt,
            });
          }
        }

        response.poleOptionBody.push({
          poleOption: option,
          poleOptionResponses: matchingResponses,
        });
      }

      res.status(200).json(response);
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: 'Id cant get from params' });
  }
};






  
// Define a route to update a particular pole by ID
const poleUpdate = async (req, res) => {
  try {
    const poleId = req.params.poleId;
    const { caption,post_desc, ...data } = req.body;

    const poleData = await pole.find({id:poleId});
    if (!poleData) {
      return res.status(404).json({ error: 'pole not found' });
    }

    // Use parameterized query to prevent SQL injection
    await db.query(updatePostTypeQuery, [caption, poleData.type]);

    await db.query(updatePostQuery, [post_desc, poleData.type]);

    // Update the pole data
    const updatedPole = await pole.findOneAndUpdate(
      { id: poleId },
      { $set: { caption, ...data } },
      { new: true }
    );
    
    res.status(200).json({ success: true, message: 'pole updated successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: error });
  }
};
  
  // Define a route to delete a particular pole by ID
  const poleDelete = async (req, res) => {
    try {
        const poleId = req.params.poleId;

        // Find the pole by ID
        const poleData = await pole.findOne({ id: poleId });

        if (!poleData) {
            return res.status(404).json({ error: 'Pole not found' });
        }

        // Delete related data in the "pole_options" model
        await pole_options.deleteMany({ pole_id: poleData.uid });

        // Delete related data in the "pole_responses" model
        await pole_response.deleteMany({ pole_id: poleData.uid });

        // Use parameterized query to prevent SQL injection
        await db.query(deletePostTypeQuery, [poleData.type]);
        await db.query(deletePostQuery, [poleData.type]);

        // Delete the pole
        const deletedPole = await pole.findByIdAndDelete(poleData._id);

        if (!deletedPole) {
            return res.status(500).json({ success: false, message: 'Failed to delete pole' });
        }

        res.status(200).json({ success: true, message: 'Pole and related data deleted successfully' });
    } catch (error) {
        console.error('Error deleting pole:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};





module.exports = {insertWithpost_type,poleCreate,poleAll,poleOne,poleUpdate,poleDelete};
