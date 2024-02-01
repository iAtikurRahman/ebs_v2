const getAllMembersQuery = `
                            SELECT 
                              e_m.id,
                              e_m.event_id,
                              e_m.user_id,
                              e_m.access_role,
                              e_m.is_approved,
                              e_m.is_invited,
                              e_m.approved_by,
                              e_m.updated_by,
                              e_m.updated_at, 
                              u.user_pic,
                              CONCAT (u.user_first_name," ",u.user_middle_name," ",u.user_last_name) AS fullName
                            FROM 
                              event_members AS e_m
                            LEFT JOIN users AS u ON u.id = e_m.user_id
                            WHERE  event_id =?`;



module.exports = {getAllMembersQuery};