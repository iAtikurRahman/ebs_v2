const router = require("express").Router();
const {getNotiByUserId} = require('../controller/notificationController')
//one id's all form
router.get('/:id', getNotiByUserId)
module.exports = router;
