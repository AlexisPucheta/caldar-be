const express = require('express');

const router = express.Router();

const companies = requiere ('../data/company.json');

/* company-controller.getAllCompanies */

router.get ('/api/company', (req, res) => res.json(companies));

/* company-controller.getCompaniesById */

router.get('/api/company/:id', (req, res) => {
    const found = companies.some(company => company._id$oid === req.params.id);
    if (found) {
        res.json(companies.filter(company => company._id$oid === req.params.id));
    } else {
        res.status(400).json({msg: "No company with id: ${req.params.id}"});
    }
});

/* company-controller.getCompaniesByAttribute */

app.get('/api/company?attrKey=attrValue', (req, res) => {
    res.send('Got a Get request at /api/company?attrKey=attrValue');
});

/* company-controller.deleteCompaniesById */

router.delete('/api/company/:id', (req, res) => {
    const found = companies.some(company => company._id._id$oid === req.params.id);
    if (found) {
        res.json(companies.filter(company => company._id$oid === req.params.id));
    } else {
        res.status(400).json({msg: "No company with id: ${req.params.id}"});
    }
});

module.exports = router