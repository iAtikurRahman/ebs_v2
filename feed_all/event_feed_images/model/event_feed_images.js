const mongoose = require('mongoose');

const event_feed_images = new mongoose.Schema({
  id: { type: Number, required: true },
  type: { type: String, required: true }, // from mysql table post_type uid here 
  img_uri: { type: [String], required: true },
  post_id: { type: Number, required: true },
  is_deleted: { type: Boolean, default: false },
  updated_by: { type: Number, required: true },
  updated_at: { type: Date, default: Date.now }
},
{ timestamps: true });

module.exports = mongoose.model('event_feed_images', event_feed_images);
