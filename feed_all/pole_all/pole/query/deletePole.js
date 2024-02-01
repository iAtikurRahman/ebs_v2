const deletePostTypeQuery = 'DELETE FROM post_type WHERE uid = ?'

const deletePostQuery = 'DELETE FROM event_feed_post WHERE type = ?'


module.exports = {deletePostTypeQuery,deletePostQuery}