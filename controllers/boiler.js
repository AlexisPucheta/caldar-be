const Boiler = require("../models/boiler.js");
const Building = require("../models/building.js");
const BoilerType = require("../models/boiler-type.js");
const boilerSchema = require("../helpers/boiler.js");
const Service = require("../models/service.js");

// Create boiler in the database. At least name is required
exports.createBoiler = async (req, res) => {
  try {
    await boilerSchema.validateAsync(req.body);
    const boiler = new Boiler({
      building: req.body.building,
      type: req.body.type,
      serialNumber: req.body.serialNumber,
      manufacturingDate: req.body.manufacturingDate,
      installationDate: req.body.installationDate,
      status: req.body.status,
    });

    let doesExist;
    doesExist = await BoilerType.find({ boilerType: boiler.type });

    if (doesExist === null) {
      res
        .status(500)
        .send({ msg: `This type of boiler ${boiler.type} doesnt exist` });
    }

    if (boiler.building !== undefined) {
      doesExist = await Building.findById(boiler.building);
      if (doesExist === null) {
        return res
          .status(500)
          .send({ msg: `Doesn't exist this building ID: ${boiler.building}` });
      }
    }

    doesExist = await Boiler.findOne({ serialNumber: boiler.serialNumber });
    if (doesExist !== null) {
      return res.status(500).send({
        msg: `This serialNumber: ${boiler.serialNumber} is already in use`,
      });
    }

    await Building.findOneAndUpdate(
      { _id: boiler.building },
      {
        $push: {
          boilers: boiler.id,
        },
      },
      { useFindAndModify: false }
    );

    boiler.save(boiler);
    return res.send(boiler);
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
exports.updateBoilerById = async (req, res) => {
  try {
    await boilerSchema.validateAsync(req.body);
    let doc = await Boiler.findById(req.params.id);
    const boiler = {
      building: req.body.building,
      type: req.body.type,
      serialNumber: doc.serialNumber, // cant change this value
      manufacturingDate: req.body.manufacturingDate,
      installationDate: req.body.installationDate,
      status: req.body.status,
    };

    let doesExist;
    doesExist = await BoilerType.find({ boilerType: boiler.type });

    if (doesExist === null) {
      res
        .status(500)
        .send({ msg: `This type of boiler ${boiler.type} doesnt exist` });
    }

    if (req.body.building !== undefined) {
      doesExist = await Building.findById(req.body.building);
      if (doesExist === null) {
        return res.status(500).send({
          msg: `Doesn't exist this building ID: ${req.body.building}`,
        });
      }
    }

    await Boiler.findByIdAndUpdate(req.params.id, boiler, {
      useFindAndModify: false,
    });

    await Building.findOneAndUpdate(
      { _id: boiler.building },
      {
        $push: {
          boilers: req.params.id,
        },
      },
      { useFindAndModify: false }
    );

    await Building.findOneAndUpdate(
      { _id: doc.building },
      {
        $pull: {
          boilers: req.params.id,
        },
      },
      { useFindAndModify: false }
    );

    doc = await Boiler.findById(req.params.id);
    return res.send(doc);
  } catch (err) {
    return res.send({ msg: `${err}` });
  }
};

// Delete boiler by id from the database.
exports.deleteBoilerById = async (req, res) => {
  try {
    const boiler = await Boiler.findById(req.params.id);
    if (boiler !== null) {
      await Building.findOneAndUpdate(
        { _id: boiler.building },
        {
          $pull: {
            boilers: req.params.id,
          },
        },
        { useFindAndModify: false }
      );
      await Boiler.deleteOne({ _id: req.params.id });

      await Service.deleteMany({ boiler: req.params.id });

      return res.send({
        msg: `Boiler with id: ${req.params.id} was deleted successfully`,
      });
    }
    return res
      .status(500)
      .send({ msg: `This boiler ID: ${req.params.id} doesnt exist` });
  } catch (err) {
    return res.send({ msg: err.message || "Error undefined" });
  }
};
