const mongoose = require('mongoose');
const deviceTokenSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  emp_id: { type: String},
  user_id: { type: String, required: true, unique: true},
  deviceToken: { type: String, required: true },
  updated_at: { type: Date, default: Date.now }
});
deviceTokenSchema.pre('save', async function (next) {
  try {
    if (!this.isNew) {
      return next();
    }
    const latestToken = await this.constructor.findOne({}, {}, { sort: { id: -1 } });
    if (latestToken) {
      this.id = latestToken.id + 1;
    } else {
      this.id = 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});
module.exports = mongoose.model('device_token', deviceTokenSchema); 