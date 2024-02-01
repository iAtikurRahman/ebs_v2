const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  type: { type: String, required: true },
  post_id: { type: String, required: true },  // from mysql table event_feed_post
  reaction_id: { type: String, required: true },  // from mysql table reaction_list
  is_deleted: { type: Boolean, default: false },
  reaction_color: { type: String },
  updated_by: { type: Number, required: true },
  updated_at: { type: Date, default: Date.now }
},
{ timestamps: true });

reactionSchema.pre('save', async function (next) {
  try {
    if (!this.isNew) {
      return next();
    }

    const latestReaction = await this.constructor.findOne({}, {}, { sort: { id: -1 } });

    if (latestReaction) {
      this.id = latestReaction.id + 1;
    } else {
      this.id = 1;
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('reactions', reactionSchema);
