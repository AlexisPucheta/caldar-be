const boiler = require('../controllers/boiler.js');

var router = require("express").Router();

// CRUD routes
// Create boiler in the database.
router.post('/', building.createBoiler);
// Retrieve all boilers or get boiler by its attributes from the database.
router.get('/', building.getBoilersAll);
// Retrieve boiler by id from the database.
router.get('/:id', building.getBoilerById);
// Update boiler by id in the database.
router.put('/:id', building.updateBoilerById);
// Delete boiler by id from the database.
router.delete('/:id', building.deleteBoilerById);

module.exports = router;