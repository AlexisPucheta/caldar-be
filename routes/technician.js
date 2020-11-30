const technician = require("../controllers/technician.js");

var router = require("express").Router();

//Retrieve all technicians
//getTechniciansAll and getTechniciansByAttribute
router.get('/', technician.getTechniciansAll);
//Retrieve technician by ID
router.get('/:id', technician.getTechnicianById);
//Delete technician by ID
router.delete('/:id', technician.deleteTechnicianById);
//Update technician by ID
router.put('/:id', technician.putTechnicianById);
//Create technician
router.post('/', technician.create);

module.exports = router;