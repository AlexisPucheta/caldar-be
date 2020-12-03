const Building = require("../models/building.js");

// Create building in the database. At least name is required
exports.createBuilding = (req, res) => {
  const building = new Building({
    name: req.body.name,
    address: req.body.address,
    boilers: req.body.boilers,
    company: req.body.company,
  });
  if (building.name !== undefined) {
    building
      .save(building)
      .then((data) => {
        return res.send({
          data,
          msg: "Building was succesfully created.",
        });
      })
      .catch((err) => {
        return res.status(500).send({
          msg: err.message || "Some error ocurred while creating new building.",
        });
      });
  }
  return res.status(400).send({ msg: "Name cannot be empty!" });
};

// Retrieve all buildings or get building by its attributes from the database.
exports.getBuildingsAll = (req, res) => {
  const key = Object.keys(req.query);
  if (JSON.stringify(req.query) === JSON.stringify({})) {
    Building.find({})
      .then((data) => {
        return res.send(data);
      })
      .catch((err) => {
        return res.status(500).send({
          msg:
            err.message || "Some error ocurred while retrieving all buildings.",
        });
      });
  } else {
    Building.find(req.query)
      .then((data) => {
        if (Object.keys(data).length !== 0) {
          return res.send(data);
        }
        return res.status(404).send({
          msg: `Doesn't exist any building with ${key}: ${req.query[key]}.`,
        });
      })
      .catch((err) => {
        return res.status(500).send({
          msg:
            err.message ||
            `Some error ocurred while retrieving buildings by ${key}.`,
        });
      });
  }
};

// Retrieve building by id from the database.
exports.getBuildingById = (req, res) => {
  Building.findById(req.params.id)
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .send({ msg: `Doesn't exist building with id: ${req.params.id}.` });
      }
      return res.send(data);
    })
    .catch((err) => {
      return res.status(500).send({
        msg:
          err.message || "Some error ocurred while retrieving building by id.",
      });
    });
};

// Update building by id in the database.
exports.updateBuildingById = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ msg: "Data to update cannot be empty!" });
  }
  if (
    !req.body.name ||
    !req.body.address ||
    !req.body.boilers ||
    !req.body.company
  ) {
    return res.status(400).send({ msg: "Content cannot be empty!" });
  }

  Building.findOneAndUpdate({ _id: req.params.id }, req.body, {
    useFindAndModify: false,
  })
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .send({ msg: `Building with id: ${req.params.id} was not found.` });
      }
      return res.send({
        data,
        msg: `Building with id: ${req.params.id} was successfully updated.`,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        msg: err.message || "Some error ocurred while updating building by id.",
      });
    });
};

// Delete building by id from the database.
exports.deleteBuildingById = (req, res) => {
  Building.findOneAndRemove({ _id: req.params.id }, { useFindAndModify: false })
    .then((data) => {
      res.send({
        data,
        msg: `Building with id: ${req.params.id} was succesfully deleted.`,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        msg: err.message || "Some error ocurred while removing building by id.",
      });
    });
};
