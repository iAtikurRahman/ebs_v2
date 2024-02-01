const postDataQuery = 'SELECT * FROM event_feed_post WHERE type=? and uid =?'
const eventOwnerQuery = `SELECT CONCAT(user_first_name," ", user_middle_name," ",user_last_name," ") AS NAME FROM users WHERE id =?`

module.exports= {postDataQuery,eventOwnerQuery}