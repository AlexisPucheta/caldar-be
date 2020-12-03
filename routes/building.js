const building = require("../controllers/building.js");

var router = require("express").Router();

// CRUD routes
// Create building in the database.
router.post('/', building.createBuilding);
// Retrieve all buildings or get building by its attributes from the database.
router.get('/', building.getBuildingsAll);
// Retrieve building by id from the database.
router.get('/:id', building.getBuildingById);
// Update building by id in the database.
router.put('/:id', building.updateBuildingById);
// Delete building by id from the database.
router.delete('/:id', building.deleteBuildingById);

module.exports = router;