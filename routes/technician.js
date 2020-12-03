const technician = require("../controllers/technician.js");

var router = require("express").Router();

// CRUD routes
//Create technician in the database.
router.post('/', technician.createTechnician);
// Retrieve all technicians or get technician by its attributes from the database.
router.get('/', technician.getTechniciansAll);
// Retrieve technician by id from the database.
router.get('/:id', technician.getTechnicianById);
// Update technician by id in the database.
router.put('/:id', technician.updateTechnicianById);
// Delete technician by id from the database.
router.delete('/:id', technician.deleteTechnicianById);

module.exports = router;