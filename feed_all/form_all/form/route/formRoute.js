const router = require("express").Router();
const {insertWithpost_type,formCreate,formIdAll,formAll,formAllAll,formOneAll,formUpdate,formDeleteAll} = require('../../controller/mongoController/formController');



//CREATE FORM
router.post('/create', insertWithpost_type);

// Create form
router.post('/', formCreate);

//get all
router.get('/', formAll)

//one id's all form
router.get('/:id', formIdAll)

// get all all
router.get('/all/',formAllAll)

//get one all
router.get('/:formId', formOneAll)

//UPDATE FORM
router.patch('/:formId', formUpdate)

// from all data delete
router.delete('/:formId', formDeleteAll)


module.exports = router;
