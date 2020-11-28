const companies = require ('../data/company.json');

/* company-controller.getAllCompanies */

exports.getCompaniesAll = (req, res) => {
    for (const key in req.query) {
        if (key ==='_id') {
            return res.json(companies.filter(companies => companies._id$oid === req.query[key]));
        } else if (key ==='name') {
            return res.json(companies.filter(companies => companies.name === req.query[key]));
        } else if (key === 'buildings') {
            return res.json(companies.filter(companies => companies.buildings === req.query[key]));
        }
        res.json(companies);
}};

/* company-controller.getCompaniesById */

exports.getCompaniesById = (req, res) =>  {
    const found = companies.some(companies => companies._id$oid === req.params.id);
    if (found) {
        res.json(companies.filter(company => company._id$oid === req.params.id));
    } else {
        res.status(400).json({msg: "No company with id: ${req.params.id}"});
    }
};

/* company-controller.deleteCompaniesById */

exports.deleteCompaniesById = (req, res) => {
    const found = companies.some(company => company._id._id$oid === req.params.id);
    if (found) {
        res.json(companies.filter(company => company._id$oid === req.params.id));
    } else {
        res.status(400).json({msg: "No company with id: ${req.params.id}"});
    }
};