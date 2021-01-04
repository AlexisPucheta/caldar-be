const Boiler = require("../models/boiler.js");
const Building = require("../models/building.js");
const BoilerType = require("../models/boiler-type.js");
const boilerSchema = require("../helpers/boiler.js");
const Service = require("../models/service.js");

// Create boiler in the database. At least name is required
exports.createBoiler = async (req, res) => {
  try {
    await boilerSchema.validateAsync(req.body);
    const newBoiler = new Boiler({
      building: req.body.building,
      type: req.body.type,
      serialNumber: req.body.serialNumber,
      manufacturingDate: req.body.manufacturingDate,
      installationDate: req.body.installationDate,
      status: req.body.status,
      obs: req.body.obs,
    });

    const boilerType = await BoilerType.find({ boilerType: newBoiler.type });
    if (boilerType === null) {
      return res.status(404).send({
        msg: `Doesn't exist this boiler type ID: ${newBoiler.type}.`,
      });
    }

    if (newBoiler.building !== undefined) {
      const building = await Building.findById(newBoiler.building);
      if (building === null) {
        return res.status(500).send({
          msg: `Doesn't exist this building ID: ${newBoiler.building}.`,
        });
      }
      await Building.updateOne(
        { _id: newBoiler.building },
        {
          $push: {
            boilers: newBoiler.id,
          },
        }
      );
    }

    const boiler = await Boiler.findOne({
      serialNumber: newBoiler.serialNumber,
    });
    if (boiler !== null) {
      return res.status(400).send({
        msg: `This boiler seril number: ${newBoiler.serialNumber} already exist.`,
      });
    }

    newBoiler.save(newBoiler);
    return res.send({
      newBoiler,
      msg: "New boiler was successfully created.",
    });
  } catch (err) {
    return res.status(500).send({
      msg: err.message || "Some error ocurred while creating new boiler.",
    });
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
    let boiler = await Boiler.findById(req.params.id);
    if (boiler === null) {
      return res
        .status(404)
        .send({ msg: `Boiler with ID: ${req.params.id} was not found.` });
    }

    await boilerSchema.validateAsync(req.body);
    const updatedBoiler = {
      building: req.body.building,
      type: req.body.type,
      serialNumber: boiler.serialNumber, // cant change this value
      manufacturingDate: req.body.manufacturingDate,
      installationDate: req.body.installationDate,
      status: req.body.status,
      obs: req.body.obs,
    };

    const boilerType = await BoilerType.find({
      boilerType: updatedBoiler.type,
    });
    if (boilerType === null) {
      return res.status(404).send({
        msg: `Doesn't exist this boiler type ID: ${updatedBoiler.type}.`,
      });
    }

    if (updatedBoiler.building !== undefined) {
      const building = await Building.findById(updatedBoiler.building);
      if (building === null) {
        return res.status(404).send({
          msg: `Doesn't exist this building ID: ${updatedBoiler.building}.`,
        });
      }
    }

    await Boiler.findByIdAndUpdate(req.params.id, updatedBoiler, {
      useFindAndModify: false,
    });

    await Building.findOneAndUpdate(
      { _id: updatedBoiler.building },
      {
        $push: {
          boilers: req.params.id,
        },
      },
      { useFindAndModify: false }
    );

    await Building.findOneAndUpdate(
      { _id: boiler.building },
      {
        $pull: {
          boilers: req.params.id,
        },
      },
      { useFindAndModify: false }
    );

    boiler = await Boiler.findById(req.params.id);

    return res.send({
      boiler,
      msg: "Boiler was successfully updated.",
    });
  } catch (err) {
    return res.status(500).send({
      msg: err.message || "Some error ocurred while updating boiler by ID.",
    });
  }
};

// Delete boiler by id from the database.
exports.deleteBoilerById = async (req, res) => {
  try {
    const boiler = await Boiler.findById(req.params.id);
    if (boiler === null) {
      return res
        .status(404)
        .send({ msg: `Boiler with ID: ${req.params.id} was not found.` });
    }

    if (boiler.building !== undefined) {
      await Building.findOneAndUpdate(
        { _id: boiler.building },
        {
          $pull: {
            boilers: req.params.id,
          },
        },
        { useFindAndModify: false }
      );
    }

    await Service.deleteMany({ boiler: req.params.id });

    await Boiler.deleteOne({ _id: req.params.id });

    return res.send({
      boiler,
      msg: `Boiler with ID: ${req.params.id} was successfully deleted.`,
    });
  } catch (err) {
    return res.status(500).send({
      msg: err.message || "Some error ocurred while deleting boiler by ID.",
    });
  }
};
