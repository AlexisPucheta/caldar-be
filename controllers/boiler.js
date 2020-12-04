const Boiler = require("../models/boiler.js");

// Create boiler in the database. At least name is required
exports.createBoiler = (req, res) => {
  const boiler = new Boiler({
    name: req.body.name,
    type: req.body.type,
  });
  if (boiler.name !== undefined) {
    boiler
      .save(boiler)
      .then((data) => {
        return res.send({
          data,
          msg: "Boiler was succesfully created.",
        });
      })
      .catch((err) => {
        return res.status(500).send({
          msg: err.message || "Some error ocurred while creating new boiler.",
        });
      });
  }
  return res.status(400).send({ msg: "Name cannot be empty!" });
};

// Retrieve all boilers or get boiler by its attributes from the database.
exports.getBoilersAll = (req, res) => {
  const key = Object.keys(req.query);
  if (JSON.stringify(req.query) === JSON.stringify({})) {
    Boiler.find({})
      .then((data) => {
        return res.send(data);
      })
      .catch((err) => {
        return res.status(500).send({
          msg:
            err.message || "Some error ocurred while retrieving all boilers.",
        });
      });
  } else {
    Boiler.find(req.query)
      .then((data) => {
        if (Object.keys(data).length !== 0) {
          return res.send(data);
        }
        return res.status(404).send({
          msg: `Doesn't exist any boiler with ${key}: ${req.query[key]}.`,
        });
      })
      .catch((err) => {
        return res.status(500).send({
          msg:
            err.message ||
            `Some error ocurred while retrieving boilers by ${key}.`,
        });
      });
  }
};

// Retrieve boiler by id from the database.
exports.getBoilerById = (req, res) => {
  Boiler.findById(req.params.id)
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .send({ msg: `Doesn't exist boiler with id: ${req.params.id}.` });
      }
      return res.send(data);
    })
    .catch((err) => {
      return res.status(500).send({
        msg: err.message || "Some error ocurred while retrieving boiler by id.",
      });
    });
};

// Update boiler by id in the database.
exports.updateBoilerById = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ msg: "Data to update cannot be empty!" });
  }
  if (!req.body.name || !req.body.type) {
    return res.status(400).send({ msg: "Content cannot be empty!" });
  }

  Boiler.findOneAndUpdate({ _id: req.params.id }, req.body, {
    useFindAndModify: false,
  })
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .send({ msg: `Boiler with id: ${req.params.id} was not found.` });
      }
      return res.send({
        data,
        msg: `Boiler with id: ${req.params.id} was successfully updated.`,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        msg: err.message || "Some error ocurred while updating boiler by id.",
      });
    });
  return false;
};

// Delete boiler by id from the database.
exports.deleteBoilerById = (req, res) => {
  Boiler.findOneAndRemove({ _id: req.params.id }, { useFindAndModify: false })
    .then((data) => {
      res.send({
        data,
        msg: `Boiler with id: ${req.params.id} was succesfully deleted.`,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        msg: err.message || "Some error ocurred while removing boiler by id.",
      });
    });
};
