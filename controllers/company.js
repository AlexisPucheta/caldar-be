const companies = require ('../data/company.json');

//company-controller.getAllCompanies
exports.getCompaniesAll = (req, res) => {
    for (const key in req.query) {
        if (key ==='buildings') {
            for (let i = 0 ; i < companies.length; i++){
                var found = companies[i].buildings.some(building => building.$oid === req.query[key]);
                if (found) {
                    return res.json(companies[i]);
                }
            }
            if (!found) {
                return res.status(400).json({msg: `Doesn't exist that company: ${req.query[key]}`})
            }
        } else if (key ==='name') {
            return res.json(companies.filter(companies => companies.name === req.query[key]));
        }
    }
    res.json(companies);
};

//company-controller.getCompaniesById

exports.getCompanyById = (req, res) =>  {
    const found = companies.some(company => company._id.$oid === req.params.id);
    if (found) {
        res.json(companies.filter(company => company._id.$oid === req.params.id));
    } else {
        res.status(400).json({msg: "No company with id: ${req.params.id}"});
    }
};

/* company-controller.deleteCompaniesById */

exports.deleteCompanyById = (req, res) => {
    const found = companies.some(company => company._id.$oid === req.params.id);
    if (found) {
        res.json({msg:`Company with id ${req.params.id} was deleted`, companies: companies.filter(company => company._id.$oid !== req.params.id)});
    } else {
        res.status(400).json({msg: `No company with id: ${req.params.id}`});
    }
};

