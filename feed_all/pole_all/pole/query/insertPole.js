const insertPostTypeQuery ='INSERT INTO post_type (uid, caption, updated_by, updated_at) VALUES (?, ?, ?, ?)'
const insertFeedPostQuery ='INSERT INTO event_feed_post (uid, type, event_id, post_desc, feed_sharing, is_deleted, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'

module.exports = {insertPostTypeQuery,insertFeedPostQuery}