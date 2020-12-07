const Boiler = require("../models/boiler.js");
const Building = require("../models/building.js");
const boilerSchema = require("../helpers/boiler.js");

// Create boiler in the database. At least name is required
exports.createBoiler = async (req, res) => {
  const boiler = new Boiler({
    building: req.body.building,
    type: req.body.type,
    serialNumber: req.body.serialNumber,
    manufacturingDate: req.body.manufacturingDate,
    instalationDate: req.body.instalationDate,
    status: req.body.status,
  });

  try {
    const result = await boilerSchema.validateAsync(req.body);
    const doesExist = [];

    if (boiler.building !== null) {
      doesExist[0] = await Building.findById(boiler.building);
      if (doesExist[0] === null) {
        return res
          .status(500)
          .send({ msg: `Doesn't exist this building ID: ${boiler.building}` });
      }
    }

    doesExist[1] = await Boiler.findOne({ serialNumber: boiler.serialNumber });
    if (doesExist[1] !== null) {
      return res.status(500).send({
        msg: `This serialNumber: ${boiler.serialNumber} is already in use`,
      });
    }

    if (!(
      boiler.status === "working" ||
      boiler.status === "need repair" ||
      boiler.status === "reserved" ||
      boiler.status === "available")
    ) {
      return res.status(500).send({
        msg: `working, need repair, reserved or available only. Not allow ${boiler.status}`,
      });
    }

    boiler.save(boiler);
    return res.send(result);
  } catch (error) {
    return res.send({ msg: `${error.message}` });
  }
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
