const technician = require("../controllers/technician");

var router = require("express").Router();

//Retrieve all technicians
//getTechniciansAll and getTechniciansByAttribute
router.get('/', technician.getTechniciansAll);
//Retrieve Technician by ID
router.get('/:id', technician.getTechniciansById);
//Delete Technician by ID
router.delete('/:id', technician.deleteTechnicianById);

module.exports = router;