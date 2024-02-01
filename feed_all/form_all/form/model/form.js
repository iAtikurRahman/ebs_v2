const mongoose = require("mongoose");
const formSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true, unique: true },
        uid: { type: String, required: true, unique: true },
        type: { type: String, required: true },
        post_id: { type: String, required: true },
        caption: { type: String },
        purpose: { type: String },
        is_deleted: { type: Boolean, default: false },
        updated_by: { type: Number, required: true },
        updated_at: { type: Date, default: Date.now }
      },
  { timestamps: true }
);
formSchema.pre('save', async function (next) {
  try {
    if (!this.isNew) {
      return next();
    }
    const latestForm = await this.constructor.findOne({}, {}, { sort: { id: -1 } });
    if (latestForm) {
      this.id = latestForm.id + 1;
    } else {
      this.id = 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});
module.exports = mongoose.model("form", formSchema);