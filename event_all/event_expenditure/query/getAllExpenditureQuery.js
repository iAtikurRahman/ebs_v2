const getAllExpenditureQuery = `
                                SELECT * 
                                FROM 
                                  event_expenditure 
                                WHERE
                                  event_id = ?`;



module.exports = {getAllExpenditureQuery};