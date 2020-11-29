const technician = require("../controllers/technician.js");

var router = require("express").Router();

//Retrieve all technicians
//getTechniciansAll and getTechniciansByAttribute
router.get('/', technician.getTechniciansAll);
//Retrieve technician by ID
router.get('/:id', technician.getTechnicianById);
//Delete technician by ID
router.delete('/:id', technician.deleteTechnicianById);

module.exports = router;