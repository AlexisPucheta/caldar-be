const router = require("express").Router();
const service = require("../controllers/service.js");

// CRUD routes
// Create technician in the database.
router.post("/", service.createService);
// Retrieve all technicians or get technician by its attributes from the database.
router.get("/", service.getServicesAll);
// Retrieve technician by id from the database.
router.get("/:id", service.getServiceById);
// Update technician by id in the database.
router.put("/:id", service.updateServiceById);
// Delete technician by id from the database.
router.delete("/:id", service.deleteServiceById);

module.exports = router;
