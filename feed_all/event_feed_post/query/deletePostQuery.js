const deletePost_type = 'DELETE FROM post_type WHERE uid = ?'
const deletePost = 'DELETE FROM event_feed_post WHERE id = ?'

module.exports = {deletePost_type,deletePost}