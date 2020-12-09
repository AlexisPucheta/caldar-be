const router = require("express").Router();
const boilerType = require("../controllers/boiler-type");

// Retrieve all boiler types
// getBoilerTypeAll and getboilerTypeByAttribute
router.get("/", boilerType.getBoilerTypeAll);
// Retrieve boiler type by ID
router.get("/:id", boilerType.getBoilerTypeById);
// Delete boiler type by ID
router.delete("/:id", boilerType.deleteBoilerTypeById);
// Update boiler type by ID
router.put("/:id", boilerType.updateBoilerTypeById);
// Create boiler type
router.post("/", boilerType.createBoilerType);

module.exports = router;
