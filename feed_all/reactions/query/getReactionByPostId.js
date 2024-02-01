const reactionListQuery = `SELECT uid,reaction_color,reaction_name,TO_BASE64(reaction_icon) AS reaction_icon FROM reaction_list WHERE uid = ?`;

module.exports = {reactionListQuery};