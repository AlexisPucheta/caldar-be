const boilerType = require("../controllers/boiler-type");

var router = require("express").Router();

//Retrieve all boiler types
//getBoilerTypeAll and getboilerTypeByAttribute
router.get('/', boilerType.getBoilerTypeAll);
router.post('/', boilerType.createNewBoilerType);
router.delete('/:id', boilerType.deleteBoilerTypeById);
router.put('/:id', boilerType.updateBoilerType);
/*//Retrieve Technician by ID
router.put('/:id', boilerType.getBoilerTypeById);
//Delete Technician by ID
router.delete('/:id', boilerType.deleteBoilerTypeById);
*/
module.exports = router;