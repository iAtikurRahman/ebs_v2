const notification = require('../model/notification');
// Get notifications by user_id
const getNotiByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        const notifi = await notification.find({ user_id: id }).sort({ updated_at: -1 });
        if (notifi.length === 0) {
            res.status(404).json({ error: "you have no notification" });
            return;
        }
        res.status(200).json(notifi);
        return;
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = {
    getNotiByUserId
};