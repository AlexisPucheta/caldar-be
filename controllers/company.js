const Company = require("../models/company.js");
const Building = require("../models/building.js");
const companySchema = require("../helpers/company.js");

// Create company in the database.
exports.createCompany = async (req, res) => {
  try {
    if (req.body.buildings === "") {
      req.body.buildings = undefined;
    }
    await companySchema.validateAsync(req.body);
    const newCompany = new Company({
      buildings: req.body.buildings,
      name: req.body.name,
      address: req.body.address,
      CIN: req.body.CIN,
      zipcode: req.body.zipcode,
      contact: req.body.contact,
      email: req.body.email,
      phone: req.body.phone,
      obs: req.body.obs,
    });

    const company = await Company.findOne({ name: newCompany.name });
    if (company !== null) {
      return res.status(400).send({
        msg: `This company name: ${newCompany.name} already exist.`,
      });
    }

   const company = await Company.findOne({ CIN: newCompany.CIN });
    if (company !== null) {
      return res.status(400).send({
        msg: `This CIN: ${newCompany.CIN} already exist.`,
      });
    }

    if (newCompany.buildings !== undefined) {
      const buildings = await Building.find({ _id: newCompany.buildings });
      if (buildings.length === newCompany.buildings.length) {
        buildings.forEach((building) => {
          if (building.company !== undefined) {
            return res.status(400).send({
              msg: `This building ID ${building.id} already belongs to a company ${building.company}.`,
            });
          }
          return false;
        });
        await Building.updateMany(
          { _id: newCompany.buildings },
          {
            company: newCompany.id,
          }
        );
      } else {
        return res
          .status(404)
          .send({ msg: "Some of the buildings doesn't exist." });
      }
    }

    newCompany.save(newCompany);
    return res.send({
      newCompany,
      msg: "New company was successfully created.",
    });
  } catch (err) {
    return res.status(500).send({
      msg: err.message || "Some error ocurred while creating new company.",
    });
  }
};

// Retrieve all companies or get company by its attributes from the database.
exports.getCompaniesAll = (req, res) => {
  const key = Object.keys(req.query);
  if (JSON.stringify(req.query) === JSON.stringify({})) {
    Company.find({})
      .then((data) => {
        return res.send(data);
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
          return res.send(data);
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

// Retrieve company by id from the database.
exports.getCompanyById = (req, res) => {
  Company.findById({ _id: req.params.id })
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .send({ msg: `Doesn't exist company with ID: ${req.params.id}.` });
      }
      return res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        msg:
          err.message || "Some error ocurred while retrieving company by ID.",
      });
    });
};

// Update company by id in the database.
exports.updateCompanyById = async (req, res) => {
  try {
    let company = await Company.findById(req.params.id);
    if (company === null) {
      return res
        .status(404)
        .send({ msg: `Company with ID: ${req.params.id} was not found.` });
    }

    await companySchema.validateAsync(req.body);
    const updatedCompany = {
      buildings: req.body.buildings,
      name: req.body.name,
      address: req.body.address,
      CIN: req.body.CIN,
      zipcode: req.body.zipcode,
      contact: req.body.contact,
      email: req.body.email,
      phone: req.body.phone,
      obs: req.body.obs,
    };

    if (updatedCompany.buildings !== undefined) {
      const buildings = await Building.find({ _id: updatedCompany.buildings });
      if (buildings.length !== updatedCompany.buildings.length) {
        return res
          .status(400)
          .send({ msg: "Some of the buildings doesn't exist." });
      }
    }

    await Company.findByIdAndUpdate(req.params.id, updatedCompany, {
      useFindAndModify: false,
    });

    await Building.updateMany(
      { _id: updatedCompany.buildings },
      {
        company: req.params.id,
      }
    );

    company = await Company.findById(req.params.id);

    return res.send({
      company,
      msg: "Company was successfully updated.",
    });
  } catch (err) {
    return res.status(500).send({
      msg: err.message || "Some error ocurred while updating company by ID.",
    });
  }
};

// Delete company by id from database
exports.deleteCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (company === null) {
      return res
        .status(404)
        .send({ msg: `Company with ID: ${req.params.id} was not found.` });
    }

    if (company.building !== undefined) {
      await Building.findOneAndUpdate(
        { _id: company.building },
        {
          $unset: {
            company: "",
          },
        },
        { useFindAndModify: false }
      );
    }

    await Company.deleteOne({ _id: req.params.id });

    return res.send({
      company,
      msg: `Company with ID: ${req.params.id} was successfully deleted`,
    });
  } catch (err) {
    return res.status(400).send({
      msg: err.message || "Some error ocurred while deleting company by ID.",
    });
  }
};
