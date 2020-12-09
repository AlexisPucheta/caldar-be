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
    if (req.body.technician !== undefined) {
      for (i = 0; i < ((boilerType.technician.length)); i++) {
        let doesExist = await Technician.findById(boilerType.technician[i]);
        if ( doesExist === null) {
            return res.status(500).send({
              msg: `Doesn't exist this technician ID: ${req.body.technician}`,
            });
        }
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
exports.updateBoilerTypeById = async (req, res) => {
  const newBoilerType = {
    boilerType: req.body.boilerType,
    stdMaintainance: req.body.stdMaintainance,
    technician: req.body.technician,
    obs: req.body.obs,
  };
  try {
    await boilerTypeSchema.validateAsync(req.body);
    let doc = await BoilerType.findById(req.params.id);
    if (req.body.technician !== undefined) {
      for (i = 0; i < ((newBoilerType.technician.length)); i++) {
        let doesExist = await Technician.findById(newBoilerType.technician[i]);
        if ( doesExist === null) {
            return res.status(500).send({
              msg: `Doesn't exist this technician ID: ${req.body.technician}`,
            });
        }
      }
    }
    await BoilerType.findByIdAndUpdate(req.params.id, newBoilerType, {
      useFindAndModify: false,
    });

    await Technician.updateMany(
      { _id: newBoilerType.technician },
      {
        $addToSet: {
          knowledge: newBoilerType.boilerType,
        },
      },
      { useFindAndModify: false }
    );

    doc = await BoilerType.findById(req.params.id);
    return res.send(doc);
  } catch (err) {
    return res.send({ msg: `${err}` });
  }
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