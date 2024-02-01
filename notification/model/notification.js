const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
  id:{type:Number,require:true},
  user_id: {type: String,require:true},
  title:{type:String},
  response: { type: Object},
  updated_at: { type: Date, default: Date.now }
});
notificationSchema.pre('save', async function (next) {
  try {
    if (!this.isNew) {
      return next();
    }
    const latestNotification = await this.constructor.findOne({}, {}, { sort: { id: -1 } });
    if (latestNotification) {
      this.id = latestNotification.id + 1;
    } else {
      this.id = 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});
module.exports = mongoose.model('notification', notificationSchema);