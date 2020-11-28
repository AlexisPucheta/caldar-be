const boilerType = require("../controllers/boiler-type");

var router = require("express").Router();

//Retrieve all boiler types
//getBoilerTypeAll and getboilerTypeByAttribute
router.get('/', boilerType.getBoilerTypeAll);
//Retrieve Technician by ID
router.get('/:id', boilerType.getBoilerTypeById);
//Delete Technician by ID
router.delete('/:id', boilerType.deleteBoilerTypeById);

module.exports = router;