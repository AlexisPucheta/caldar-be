const BoilerType = require("../models/boiler-type");

// Create a boiler type. At least desc is required
exports.createBoilerType = (req, res) => {
  const boilerType = new BoilerType({
    desc: req.body.desc,
  });
  if (boilerType.desc !== undefined) {
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
  return res.status(400).send({ msg: "Desc cannot be empty" });
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
