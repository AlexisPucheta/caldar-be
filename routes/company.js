const router = require("express").Router();
const company = require("../controllers/company.js");

// getCompaniesAll and getCompaniesByAttribute
router.get("/", company.getCompaniesAll);
// Retrieve company by ID
router.get("/:id", company.getCompanyById);
// Delete company by ID
router.delete("/:id", company.deleteCompanyById);
// Update company by ID
router.put("/:id", company.updateCompanyById);
// Create Company
router.post("/", company.createCompany);

module.exports = router;
