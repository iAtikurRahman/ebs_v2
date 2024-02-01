const router = require("express").Router();
const {insertWithpost_type,poleCreate,poleAll,poleOne,poleUpdate,poleDelete} = require('../controller/poleController');


//pole create
router.post('/create', insertWithpost_type)

router.post('/', poleCreate)

//pole all
router.get('/',poleAll)

//pole one 
router.get('/:id',poleOne)

//pole update
router.patch('/:poleId',poleUpdate)

//pole delete 
router.delete('/:poleId',poleDelete)


module.exports = router;
