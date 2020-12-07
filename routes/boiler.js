const router = require("express").Router();
const boiler = require("../controllers/boiler.js");

// CRUD routes
// Create boiler in the database.
router.post("/", boiler.createBoiler);
// Retrieve all boilers or get boiler by its attributes from the database.
router.get("/", boiler.getBoilersAll);
// Retrieve boiler by id from the database.
router.get("/:id", boiler.getBoilerById);
// Update boiler by id in the database.
router.put("/:id", boiler.updateBoilerById);
// Delete boiler by id from the database.
router.delete("/:id", boiler.deleteBoilerById);

module.exports = router;
