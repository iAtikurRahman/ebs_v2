const updatePostType = `UPDATE 
                            post_type p 
                        SET caption = ?
                        WHERE 
                            p.uid = (SELECT e.type FROM event_feed_post e WHERE e.id = ?)`;

const updatePost = 'UPDATE event_feed_post SET ? WHERE id = ?'


module.exports = {updatePostType,updatePost};
