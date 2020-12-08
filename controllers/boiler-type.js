const BoilerType = require("../models/boiler-type");
const Technician = require("../models/technician.js");
const boilerTypeSchema = require("../helpers/boiler-type.js");

// Create a boiler type. At least model is required
exports.createBoilerType = async (req, res) => {
  const boilerType = new BoilerType({
    boilerType: req.body.boilerType,
    stdMaintainance: req.body.stdMaintainance,
    technician: req.body.technician,
    obs: req.body.obs,
  });
  try {
    await boilerTypeSchema.validateAsync(req.body);
    let doesExist;
    if (boilerType.technician !== undefined) {
      doesExist = await Technician.findById(boilerType.technician);
      if (doesExist === null) {
        return res.status(500).send({
          msg: `Doesn't exist this technician ID: ${boilerType.technician}`,
        });
      }
    }
    doesExist = await BoilerType.findOne({
      boilerType: boilerType.boilerType,
    });
    if (doesExist !== null) {
      return res.status(500).send({
        msg: `This boilerType: ${boilerType.boilerType} is already created`,
      });
    }
    if (boilerType.boilerType !== undefined) {
      boilerType
        .save(boilerType)
        .then((data) => {
          return res.send({
            data,
            msg: "Boiler type was succesfully created",
          });
        })
        .catch((err) => {
          return res.send.status(500).send({
            msg:
              err.message ||
              "Something error ocurred while creating a new Boiler type!",
          });
        });
    }
  } catch (error) {
    return res.send({ msg: `${error.message}` });
  }
  return false;
};

// Retrieve all boiler types or boiler type by its attributes from the database.
exports.getBoilerTypeAll = (req, res) => {
  const key = Object.keys(req.query);
  if (JSON.stringify(req.query) === JSON.stringify({})) {
    BoilerType.find({})
      .then((data) => {
        return res.send(data);
      })
      .catch((err) => {
        return res.status(500).send({
          msg:
            err.message ||
            "Some error ocurred while retrieving all Boiler types.",
        });
      });
  } else {
    BoilerType.find(req.query)
      .then((data) => {
        if (Object.keys(data).length !== 0) {
          return res.send(data);
        }
        return res.status(404).send({
          msg: `Doesn't exist any Boiler type with ${key}: ${req.query[key]}.`,
        });
      })
      .catch((err) => {
        return res.status(500).send({
          msg:
            err.message ||
            `Some error ocurred while retrieving Boiler types by ${key}.`,
        });
      });
  }
};

// Retrieve boilertype by id from the database
exports.getBoilerTypeById = (req, res) => {
  BoilerType.findById(req.params.id)
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .send({ msg: `Doesn´t exist Boiler type with id=${req.params.id}` });
      }
      return res.send(data);
    })
    .catch((err) => {
      return res.status(500).send({
        msg:
          err.message ||
          "Some error ocurred while retrieving boiler type by id.",
      });
    });
};

// Update boiler type by id. All register are needed.
exports.putBoilerType = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update cannot be empty",
    });
  }
  if (!req.body.desc) {
    return res.status(400).send({ msg: "Content cannot be empty" });
  }
  BoilerType.findOneAndUpdate({ _id: req.params.id }, req.body, {
    useFindAndModify: false,
  })
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          msg: `Boiler type with id=${req.params.id} was not found`,
        });
      }
      return res.send({
        data,
        msg: `Boiler type with id=${req.params.id} was update successfully`,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        msg:
          err.message || "Some error ocurred while updating boiler type by id.",
      });
    });
  return false;
};

// Delete boiler type by id from the database
exports.deleteBoilerTypeById = (req, res) => {
  BoilerType.findOneAndDelete(
    { _id: req.params.id },
    { useFindAndModify: false }
  )
    .then((data) => {
      return res.send({
        data,
        msg: `Boiler type with id: ${req.params.id} was succesfully deleted.`,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        msg:
          err.message || "Some error ocurred while removing boiler type by id.",
      });
    });
};
