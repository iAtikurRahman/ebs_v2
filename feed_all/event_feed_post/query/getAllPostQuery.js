const getAllPostQuery = `
            SELECT
                f_p.id,
                f_p.uid,
                f_p.type,
                f_p.event_id,
                f_p.post_desc,
                TO_BASE64(p.caption) AS caption,
                f_p.feed_sharing,
                f_p.is_deleted,
                f_p.updated_by,
                f_p.updated_at,
                CONCAT(u.user_first_name, " ", u.user_middle_name, " ", u.user_last_name) AS fullName,
                u.user_pic
            FROM 
                event_feed_post AS f_p
            LEFT JOIN 
                post_type AS p ON p.uid = f_p.type
            LEFT JOIN
                users AS u ON u.id = f_p.updated_by
            WHERE
                f_p.event_id IS NULL
            ORDER BY
                f_p.updated_at DESC
            LIMIT ?
            OFFSET ?`
const getReactionList = 'SELECT uid,reaction_color,reaction_name,TO_BASE64(reaction_icon) AS reaction_icon FROM reaction_list WHERE uid = ? '
module.exports = {getAllPostQuery,getReactionList};
