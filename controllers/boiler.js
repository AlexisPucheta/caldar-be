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
    installationDate: req.body.installationDate,
    status: req.body.status,
  });

  try {
    const result = await boilerSchema.validateAsync(req.body);
    const doesExist = [];
    if (boiler.building !== undefined) {
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

    if (
      !(
        boiler.status === "working" ||
        boiler.status === "need repair" ||
        boiler.status === "reserved" ||
        boiler.status === "available"
      )
    ) {
      return res.status(500).send({
        msg: `working, need repair, reserved or available only. Not allow ${boiler.status}`,
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
exports.updateBoilerById = async (req, res) => {
  try {
    const result = await boilerSchema.validateAsync(req.body);
    console.log(result);
    let doc = await Boiler.findById(req.params.id);
    const boiler = {
      building: req.body.building,
      type: req.body.type,
      serialNumber: doc.serialNumber, // cant change this value
      manufacturingDate: req.body.manufacturingDate,
      installationDate: req.body.installationDate,
      status: req.body.status,
    };

    if (req.body.building !== undefined) {
      const doesExist = await Building.findById(req.body.building);
      if (doesExist === null) {
        return res.status(500).send({
          msg: `Doesn't exist this building ID: ${req.body.building}`,
        });
      }
    }

    if (
      !(
        boiler.status === "working" ||
        boiler.status === "need repair" ||
        boiler.status === "reserved" ||
        boiler.status === "available"
      )
    ) {
      return res.status(500).send({
        msg: `working, need repair, reserved or available only. Not allow ${boiler.status}`,
      });
    }
    console.log("this is boiler", boiler);
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
    doc = await Boiler.findById(req.params.id);
    res.send(doc);
  } catch (err) {
    return res.send({ msg: `Que paso? ${err}` });
  }
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
