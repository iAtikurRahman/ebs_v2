const insertExpenditureQuery = `INSERT INTO
                                  event_expenditure (
                                    uid, 
                                    event_id, 
                                    expenditure_cause, 
                                    expenditure_amount, 
                                    user_id,updated_by) 
                                VALUES (?, ?, ?, ?, ?,?)`



module.exports = {insertExpenditureQuery};