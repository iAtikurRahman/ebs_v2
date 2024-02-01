const mongoose = require('mongoose');
const event_feed_commentsSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique:true },
  type: { type: String, required: true }, // from mysql table post_type
  post_id: { type: String, required: true }, // from mysql table event_feed_post
  parent_comment_id: { type: String },
  caption: { type: String },
  is_deleted: { type: Boolean, default: false },
  sorting_order: { type: String },
  updated_by: { type: Number, required: true },
  updated_at: { type: Date, default: Date.now }
},
{ timestamps: true });
event_feed_commentsSchema.pre('save', async function (next) {
  try {
    if (!this.isNew) {
      return next();
    }
    const latestComment = await this.constructor.findOne({}, {}, { sort: { id: -1 } });
    if (latestComment) {
      this.id = latestComment.id + 1;
    } else {
      this.id = 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});
module.exports = mongoose.model('event_feed_comments', event_feed_commentsSchema);