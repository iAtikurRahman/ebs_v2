const deleteEventMembers = 'DELETE FROM event_members WHERE event_id = ?'
const deleteEventLocation = 'DELETE FROM event_location WHERE event_id = ?'
const deleteEventCollection = 'DELETE FROM event_collection WHERE event_id = ?'
const deleteEventExpenditure = 'DELETE FROM event_expenditure WHERE event_id = ?'
const deleteEventattendees = 'DELETE FROM event_attendees WHERE event_id = ?'
const deleteEventQ = 'DELETE FROM event WHERE id = ?'

module.exports = {deleteEventMembers,deleteEventLocation,deleteEventCollection,deleteEventExpenditure,deleteEventattendees,deleteEventQ}