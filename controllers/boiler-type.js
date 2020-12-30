const BoilerType = require("../models/boiler-type.js");
const Technician = require("../models/technician.js");
const boilerTypeSchema = require("../helpers/boiler-type.js");

// Create a boiler type in the database.
exports.createBoilerType = async (req, res) => {
  try {
    await boilerTypeSchema.validateAsync(req.body);
    const newBoilerType = new BoilerType({
      boilerType: req.body.boilerType,
      stdMaintainance: req.body.stdMaintainance,
      technician: req.body.technician,
      obs: req.body.obs,
    });

    const boilerType = await BoilerType.findOne({
      boilerType: newBoilerType.boilerType,
    });
    if (boilerType !== null) {
      return res.status(400).send({
        msg: `This boiler type: ${newBoilerType.boilerType} already exist.`,
      });
    }

    if (newBoilerType.technician.length !== 0) {
      const technicians = await Technician.find({
        _id: newBoilerType.technician,
      });
      if (technicians.length !== newBoilerType.technician.length) {
        return res
          .status(404)
          .send({ msg: "Some of the technicians doesn't exist." });
      }

      await Technician.updateMany(
        { _id: newBoilerType.technician },
        {
          $push: {
            knowledge: newBoilerType.boilerType,
          },
        }
      );
    }

    newBoilerType.save(newBoilerType);
    return res.send({
      newBoilerType,
      msg: "New boiler type was successfully created.",
    });
  } catch (err) {
    return res.status(500).send({
      msg: err.message || "Some error ocurred while creating new boiler type.",
    });
  }
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
  try {
    let boilerType = await BoilerType.findById(req.params.id);
    if (boilerType === null) {
      return res
        .status(404)
        .send({ msg: `Boiler type with ID: ${req.params.id} was not found.` });
    }

    await boilerTypeSchema.validateAsync(req.body);
    const updatedBoilerType = {
      boilerType: boilerType.boilerType,
      stdMaintainance: req.body.stdMaintainance,
      technician: req.body.technician,
      obs: req.body.obs,
    };

    if (updatedBoilerType.technician !== undefined) {
      const technicians = await Technician.find({
        _id: updatedBoilerType.technician,
      });
      if (technicians.length !== updatedBoilerType.technician.length) {
        return res
          .status(400)
          .send({ msg: "Some of the technicians doesn't exist." });
      }
    }

    await BoilerType.findByIdAndUpdate(req.params.id, updatedBoilerType, {
      useFindAndModify: false,
    });

    await Technician.updateMany(
      { _id: boilerType.technician },
      {
        $pull: {
          knowledge: boilerType.boilerType,
        },
      }
    );

    await Technician.updateMany(
      { _id: updatedBoilerType.technician },
      {
        $push: {
          knowledge: updatedBoilerType.boilerType,
        },
      }
    );

    boilerType = await BoilerType.findById(req.params.id);

    return res.send({
      boilerType,
      msg: "Boiler type was successfully updated.",
    });
  } catch (err) {
    return res.status(500).send({
      msg:
        err.message || "Some error ocurred while updating boiler type by ID.",
    });
  }
};

// Delete boiler type by id from the database
exports.deleteBoilerTypeById = async (req, res) => {
  try {
    const boilerType = await BoilerType.findById(req.params.id);
    if (boilerType === null) {
      return res
        .status(404)
        .send({ msg: `Boiler type with ID: ${req.params.id} was not found.` });
    }

    if (boilerType.technician !== undefined) {
      await Technician.updateMany(
        { _id: boilerType.technician },
        {
          $pull: {
            knowledge: req.params.id,
          },
        }
      );
    }

    await BoilerType.deleteOne({ _id: req.params.id });

    return res.send({
      boilerType,
      msg: `Boiler type with ID: ${req.params.id} was successfully deleted.`,
    });
  } catch (err) {
    return res.status(500).send({
      msg:
        err.message || "Some error ocurred while deleting boiler type by ID.",
    });
  }
};
