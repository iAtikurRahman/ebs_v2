const userInfo = `SELECT CONCAT (user_first_name," ",user_middle_name," ",user_last_name) AS fullName, user_pic FROM users WHERE id = ?`;

module.exports = {userInfo}