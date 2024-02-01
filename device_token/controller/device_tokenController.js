const device_token = require('../model/device_token');
// CREATE a new reaction
const createUserToken = async (req, res) => {
    try {
      const { emp_id, user_id, deviceToken } = req.body;
  
      // Check if there is an existing token for the given user_id
      const existingToken = await device_token.findOne({ user_id: user_id });
  
      if (existingToken) {
        existingToken.emp_id = emp_id || null;
        existingToken.deviceToken = deviceToken;
  
        const updatedToken = await existingToken.save(); // Use existingToken.save() to update existing record
        res.status(200).json(updatedToken);
        return;
      } else {
        // If no existing token is found, create a new one
        const newToken = new device_token({
          id:1,
          user_id: user_id,
          emp_id: emp_id || null,
          deviceToken: deviceToken,
        });
  
        const createdToken = await newToken.save(); // Use newToken.save() to save the new record
        res.status(201).json(createdToken);
        return;
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };
  // Get all tokens
const getAllTokens = async (req, res) => {
    try {
      const allTokens = await device_token.find();
      if (allTokens.length>0) {
        res.status(200).json(allTokens);
        return;
      } else {
        res.status(404).json({ error: "No Token found" });
        return;
      }
    } catch (error) {
      res.status(500).json({ error: error});
    }
  };
// Get one token by user_id
const getTokenByUserId = async (req, res) => {
    
  
    try {
      const { user_id } = req.params;
      const token = await device_token.findOne({ user_id: user_id });
  
      if (token) {
        res.status(200).json(token);
        return;
      } else {
        res.status(404).json({ error: "Token not found" });
        return;
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };
  
  // Delete one token by user_id
const deleteToken = async (req, res) => {
    try {
      const { user_id } = req.params;
      const deletedToken = await device_token.findOneAndDelete({ user_id: user_id });
  
      if (deletedToken) {
        res.status(200).json({msg:`user ${deletedToken.user_id} has deleted.`});
        return;
      } else {
        res.status(404).json({ error: "Token not found" });
        return;
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };
  
  module.exports = {
    createUserToken,
    getAllTokens,
    getTokenByUserId,
    deleteToken,
  };