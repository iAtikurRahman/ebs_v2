const updatePostTypeQuery = 'UPDATE post_type p SET caption = ? WHERE p.uid = ?'
const updatePostQuery = 'UPDATE event_feed_post SET post_desc = ? WHERE type = ?'


module.exports = {updatePostTypeQuery,updatePostQuery};