// Create your router
const router = require("express").Router();

// Add your routers
const technicianRouter = require("./technician.js");
const companyRouter = require("./company.js");
const buildingRouter = require("./building.js");
const boilerRouter = require("./boiler.js");
const boilerTypeRouter = require("./boiler-type.js");
const serviceRouter = require("./service.js");
// const authRouter = require("./auth.js");

// Use your router
router.use("/api/technician", technicianRouter);
router.use("/api/company", companyRouter);
router.use("/api/building", buildingRouter);
router.use("/api/boiler", boilerRouter);
router.use("/api/boiler-type", boilerTypeRouter);
router.use("/api/service", serviceRouter);

module.exports = router;
