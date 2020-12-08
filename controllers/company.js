const Company = require("../models/company.js");
const companySchema = require("../helpers/company.js");
const building = require("../models/building.js");


// Create company in the database.

exports.createCompany = async (req, res) => {
  const company = new Company ({
    name: req.body.name,
    cin: req.body.cin,
    adress: req.body.adress,
    zipcode: req.body.zipcode,
    contact: req.body.contact,
    email: req.body.email,
    phone: req.body.phone,
    building: req.body.building,
  });

  try {
    const result = await companySchema.validateAsync(req.body);
    const doesExist = [];
    if (company.building !== undefined) {
      doesExist[0] = await building.findById(company.building);
      if (doesExist[0] === null) {
        return res
          .status(500)
          .send({ msg:` Doesn't exist this building ID: ${company.building}`});
      }
    }

  doesExist[1] = await Company.findOne({ name: company.name });
  if (doesExist[1] !== null) {
    return res.status(500).send({
      msg: `This name: ${company.name} is already taken`
    });
  }

  doesExist [1] = await Company.findOne({ cin: company.cin});
  if (doesExist[1] !== null) {
    return res.status(500).send({
      msg: `This cin: ${company.cin} is already taken`
    });
  }

  await Company.findOneAndUpdate(
    {_id: company.building},
    {
      $push: {
        company: company.id,
      },
    },
    { useFindAndModify: false}
  );

  company.save(company);
  return res.send(result);
  } catch (err) {
    return res.send({ msg: `${error.message}`})
  };
};

// company-controller.getAllCompanies or getCompaniesByAttribute
exports.getCompaniesAll = (req, res) => {
  const key = Object.keys(req.query);
  if (JSON.stringify(req.query) === JSON.stringify({})) {
    Company.find({})
      .then((data) => {
        return res.status(200).send(data);
      })
      .catch((err) => {
        return res.status(500).send({
          msg:
            err.message || "Some error ocurred while requesting all companies",
        });
      });
  } else {
    Company.find(req.query)
      .then((data) => {
        if (Object.keys(data).length !== 0) {
          return res.status(200).send(data);
        }
        return res.status(404).send({
          msg: `Doesn't exist any company with ${key}: ${req.query[key]}.`,
        });
      })
      .catch((err) => {
        return res.status(500).send({
          msg:
            err.message ||
            `Some error ocurred while retrieving companies by ${key}`,
        });
      });
  }
};

// company-controller.getCompanyById
exports.getCompanyById = (req, res) => {
  Company.findById({ _id: req.params.id })
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: `Company with id ${req.params.id} was not found`,
        });
      }
      return res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error ocurred while requesting data",
      });
    });
};






































/*const Company = require("../models/company");

// company-controller.create
exports.createCompany = (req, res) => {
  // Validate request
  if (!req.body.name || !req.body.buildings) {
    res.status(400).send({ message: "There is no data to create" });
    return;
  }
  // Create company
  const company = new Company({
    name: req.body.name,
    buildings: req.body.buildings,
  });
  // Save company
  company
    .save(company)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "There is an error creating a new company",
      });
    });
};


// company-controller.updateCompanyById
exports.updateCompanyById = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ msg: `Data to update cannot be empty` });
  }
  if (!req.body.name || !req.body.buildings) {
    return res.status(400).send({ msg: `Content cannot be empty` });
  }

  Company.findByIdAndUpdate({ _id: req.params.id }, req.body, {
    useFindAndModify: false,
  })
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .send({ msg: `Company with id ${req.params.id}was not found` });
      }
      return res
        .status(200)
        .send({ msg: `Company with id ${req.params.id}was updated` });
    })
    .catch((err) => {
      return res.status(500).send({
        msg: err.message || "Some error ocurred while updating company by id",
      });
    });
  return false;
};

// company-controller.deleteCompaniesById
exports.deleteCompanyById = (req, res) => {
  Company.findByIdAndRemove({ _id: req.params.id }, { useFindAndModify: false })
    .then((data) => {
      res.status(200).send({
        data,
        msg: `Company with id: ${req.params.id}was deleted.`,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        msg: err.message || "Some error curred while removing company by id",
      });
    });
};
*/