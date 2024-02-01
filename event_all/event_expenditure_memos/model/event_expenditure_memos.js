const mongoose = require('mongoose');


const event_expenditure_memosSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  event_expenditure_id: { type: String, required: true },
  memo_link: { type: String, required: true },
  updated_by: { type: Number, required: true },
  updated_at: { type: Date, default: Date.now }
});


event_expenditure_memosSchema.pre('save', async function (next) {
  try {
    if (!this.isNew) {
      return next();
    }
    const latestMemo = await this.constructor.findOne({}, {}, { sort: { id: -1 } });
    if (latestMemo) {
      this.id = latestMemo.id + 1;
    } else {
      this.id = 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});



module.exports = mongoose.model('event_expenditure_memos', event_expenditure_memosSchema);