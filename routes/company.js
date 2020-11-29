const company = require("../controllers/company.js");

var router = require("express").Router();

//Retrieve all companies
//getCompaniesAll and getCompaniesByAttribute
router.get('/', company.getCompaniesAll);
//Retrieve company by ID
router.get('/:id', company.getCompanyById);
//Delete company by ID
router.delete('/:id', company.deleteCompanyById);

module.exports = router;