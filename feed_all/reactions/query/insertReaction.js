const selectPostQuery = 'SELECT * FROM event_feed_post WHERE type=? AND uid=?';
const updateReactionList = 'UPDATE reaction_list SET reaction_color=?, reaction_name=?, reaction_icon=? WHERE uid=?';
const reactorQuery = `SELECT CONCAT(user_first_name, " ", user_middle_name, " ", user_last_name) AS NAME FROM users WHERE id=?`;
const insertReactionList = 'INSERT INTO reaction_list (uid, reaction_color, reaction_name, reaction_icon, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?)';
module.exports = {selectPostQuery,updateReactionList,reactorQuery,insertReactionList}