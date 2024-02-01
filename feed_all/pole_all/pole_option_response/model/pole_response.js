const mongoose = require('mongoose');
const pole_responseSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  pole_id: { type: String, required: true },
  pole_option_id: { type: String, required: true },
  caption: { type: String, required: true },
  updated_by: { type: Number, required: true },
  updated_at: { type: Date, default: Date.now }
},
{ timestamps: true });
pole_responseSchema.pre('save', async function (next) {
  try {
    if (!this.isNew) {
      return next();
    }
    const latestPole = await this.constructor.findOne({}, {}, { sort: { id: -1 } });
    if (latestPole) {
      this.id = latestPole.id + 1;
    } else {
      this.id = 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});
module.exports = mongoose.model('pole_response', pole_responseSchema);