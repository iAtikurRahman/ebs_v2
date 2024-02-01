const getAllEventQuery = `
    SELECT 
      e.id,
      e.uid,
      e.event_name,
      e.privacy,
      e.location,
      e.purpose,
      e.expected_per_person_expense,
      e.office_payment_ratio,
      e.total_expected_expenses,
      e.event_invited_link,
      e.event_date_time,
      e.event_organizer_team_id,
      e.payment_status,
      e.visibility,
      e.updated_by,
      e.updated_at,
      e.cover_photo,
      CONCAT(u.user_first_name, " ", u.user_middle_name, " ", u.user_last_name) AS fullName
    FROM 
      event AS e
    LEFT JOIN 
      users AS u ON u.id = e.event_organizer_team_id
    ORDER BY 
      e.updated_at DESC
    LIMIT ?
    OFFSET ?;
  `;



module.exports = {getAllEventQuery};