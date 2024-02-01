  const insertEventQuery = `
    INSERT INTO event (
      uid, 
      event_name, 
      privacy, 
      location, 
      purpose, 
      expected_per_person_expense, 
      office_payment_ratio, 
      total_expected_expenses, 
      event_invited_link, 
      event_date_time, 
      event_organizer_user_id, 
      event_organizer_team_id, 
      updated_by, 
      payment_status, 
      visibility, 
      cover_photo
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;



module.exports = {insertEventQuery};