const Company = require("../models/company.js");
const companySchema = require("../helpers/company.js");
const Building = require("../models/building.js");
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

// Update company by id in database

exports.updateCompanyById = async (req, res) => {
  try {
    await companySchema.validateAsync(req.body);
    let doc = await Company.findById(req.params.id);
    const company = {
      name: req.body.name,
      cin: req.body.cin,
      adress: req.body.adress,
      zipcode: req.body.zipcode,
      contact: req.body.contact,
      email: req.body.email,
      phone: req.body.phone,
      building: req.body.building,
    };

    if (req.body.building !== undefined) {
      const doesExist = await Building.findById(req.body.building);
      if (doesExist === null) {
        return res.status(500).send({
          msg: `Doesn't exist this building ID: ${req.body.building}`
        });
      }
    }

    await Company.findByIdAndUpdate(req.params.id, company, {
      useFindAndModify: false,
    });

    await Building.findOneAndUpdate(
      {_id: company.building},
      {
        $push: {
          company: req.params.id,
        },
      },
      { useFindAndModify: false}
    );
    company.save(company);
    return res.send(company);
  } catch (error) {
    return res.send({msg: `${error.message}`});
  }
};

// Delete company by id from database

exports.deleteCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (company !== null) {
      if (company.building !== undefined) {
        await building.findOneAndUpdate(
          { _id: company.building},
          {
            $pull: {
              company: req.params.id,
            },
          },
          { useFindAndModify: false }
        );
      }

      await Company.deleteOne({ _id: req.params.id});

      return res.send({
        company,
        msg: `Company with id: ${req.params.id}was succesfully deleted`
      });
    }
    return res
      .status(404)
      .send ({ msg:`Company with id: ${req.params.id}was not found`});
  } catch (err) {
    return res.status(400).send ({
      msg: err.message || "Some error ocurred while deleting company"
    });
  }
};
