const Company = require("../models/company.js");
const companySchema = require("../helpers/company.js");
const Building = require("../models/building.js");

// Create company in the database.

exports.createCompany = async (req, res) => {
  try {
    await companySchema.validateAsync(req.body);

    const newCompany = new Company({
      name: req.body.name,
      CIN: req.body.CIN,
      adress: req.body.adress,
      zipcode: req.body.zipcode,
      contact: req.body.contact,
      email: req.body.email,
      phone: req.body.phone,
      buildings: req.body.buildings,
    });

    const doesExist = [];

    if (newCompany.buildings !== undefined) {
      const buildings = await Building.find({ _id: newCompany.buildings });
      if (buildings === null) {
        return res.status(404).send({
          msg: `Doesn't exist this building ID: ${newCompany.buildings}`,
        });
      }
      buildings.forEach((building) => {
        if (building.company !== undefined) {
          return res.status(500).send({
            msg: `This building id ${building.id} already belongs to a company ${building.company}.`,
          });
        }
        return false;
      });
    }

    await Building.updateMany(
      { _id: newCompany.buildings },
      { company: newCompany.id }
    );

    doesExist[1] = await Company.findOne({ name: newCompany.name });
    if (doesExist[1] !== null) {
      return res.status(500).send({
        msg: `This name: ${newCompany.name} is already taken`,
      });
    }

    doesExist[1] = await Company.findOne({ CIN: newCompany.CIN });
    if (doesExist[1] !== null) {
      return res.status(500).send({
        msg: `This cin: ${newCompany.CIN} is already taken`,
      });
    }

    newCompany.save(newCompany);
    return res.send({
      newCompany,
    });
  } catch (err) {
    return res.status(500).send({ msg: `${err.message}` });
  }
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
    let company = await Company.findById(req.params.id);
    if (company === null) {
      return res
        .status(404)
        .send({ msg: `Company with ID: ${req.params.id} was not found.` });
    }

    await companySchema.validateAsync(req.body);

    const updateCompany = {
      name: req.body.name,
      cin: req.body.cin,
      adress: req.body.adress,
      zipcode: req.body.zipcode,
      contact: req.body.contact,
      email: req.body.email,
      phone: req.body.phone,
      buildings: req.body.buildings,
    };

    if (updateCompany.buildings !== undefined) {
      const building = await Building.findById(updateCompany.buildings);
      if (building === null) {
        return res.status(500).send({
          msg: `Doesn't exist this building ID: ${updateCompany.buildings}`,
        });
      }
    }

    await Company.findByIdAndUpdate(req.params.id, updateCompany, {
      useFindAndModify: false,
    });

    await Building.updateMany(
      { _id: updateCompany.buildings },
      { building: req.params.id },
      { company: req.params.id }
    );

    company = await Company.findById(req.params.id);

    return res.send({
      company,
      msg: "Company was successfully updated.",
    });
  } catch (err) {
    return res.status(500).send({
      msg: err.message || "Some error ocurred while updating Company by ID.",
    });
  }
};

// Delete company by id from database

exports.deleteCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (company !== null) {
      if (company.building !== undefined) {
        await Building.findOneAndUpdate(
          { _id: company.building },
          {
            $pull: {
              company: req.params.id,
            },
          },
          { useFindAndModify: false }
        );
      }

      await Company.deleteOne({ _id: req.params.id });

      return res.send({
        company,
        msg: `Company with id: ${req.params.id}was succesfully deleted`,
      });
    }
    return res
      .status(404)
      .send({ msg: `Company with id: ${req.params.id}was not found` });
  } catch (err) {
    return res.status(400).send({
      msg: err.message || "Some error ocurred while deleting company",
    });
  }
};
