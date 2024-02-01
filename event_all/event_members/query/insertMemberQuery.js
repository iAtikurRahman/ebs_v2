const eventQuery = 'SELECT * FROM event WHERE uid = ?'
const existingMemberQuery = 'SELECT * FROM event_members WHERE event_id = ? AND user_id = ?'
const eventOwnerQuery = `SELECT CONCAT(user_first_name," ", user_middle_name," ",user_last_name," ") AS NAME FROM users WHERE id =?`
const insertMemberQuery = 'INSERT INTO event_members (user_id, event_id, access_role, is_approved, is_invited, approved_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?)'


module.exports = {eventQuery,existingMemberQuery,eventOwnerQuery,insertMemberQuery};