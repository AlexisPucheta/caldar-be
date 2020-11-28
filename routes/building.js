const building = require("../controllers/building.js");

var router = require("express").Router();

//Retrieve all buildings
//getBuildingsAll and getBuildingsByAttribute
router.get('/', building.getBuildingsAll);
//Retrieve building by ID
router.get('/:id', building.getBuildingById);
//Delete building by ID
router.delete('/:id', building.deleteBuildingById);

module.exports = router;