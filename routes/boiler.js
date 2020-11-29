const boiler = require('../controllers/boiler.js');

var router = require("express").Router();

//Retrieve all boilers
//getBoilersAll and getBoilersByAttribute
router.get('/', boiler.getBoilersAll);
//Retrieve boiler by ID
router.get('/:id', boiler.getBoilerById);
//Delete boiler by ID
router.delete('/:id', boiler.deleteBoilerById);

module.exports = router;