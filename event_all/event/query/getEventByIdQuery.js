const getEventByIdQuery =`SELECT e.id,e.uid,e.event_name,e.privacy,e.location,e.purpose,e.expected_per_person_expense,e.office_payment_ratio,e.total_expected_expenses,e.event_invited_link,e.event_date_time,e.event_organizer_user_id,e.event_organizer_team_id,e.payment_status,e.visibility,e.updated_by,e.updated_at,e.cover_photo, CONCAT(u.user_first_name, u.user_middle_name, u.user_last_name) AS name, u.user_pic FROM event AS e LEFT JOIN users AS u ON u.id = e.updated_by WHERE e.id = ?`;
const getEventMemberQuery = `SELECT * FROM event_members WHERE event_id = ?`;
const getEventLocationQuery = `SELECT * FROM event_location WHERE event_id = ?`;
const getEventCollectionQuery = `SELECT * FROM event_collection WHERE event_id = ?`;
const getEventExpendtureQuery = `SELECT * FROM event_expenditure WHERE event_id = ?`;
const getEventAttendeesQuery = `SELECT * FROM event_attendees WHERE event_id = ?`;
module.exports={getEventByIdQuery,getEventMemberQuery,getEventLocationQuery,getEventCollectionQuery,getEventExpendtureQuery,getEventAttendeesQuery}

