const router = require("express").Router();
const {createUserToken,getAllTokens,getTokenByUserId,deleteToken} = require('../controller/device_tokenController');
//token create & update
router.post('/', createUserToken)
//token all
router.get('/',getAllTokens)
//token one 
router.get('/:user_id',getTokenByUserId)
//token delete 
router.delete('/:user_id',deleteToken)
module.exports = router;
