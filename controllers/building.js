const Building = require("../models/building.js");
const Company = require("../models/company.js");
const Boiler = require("../models/boiler.js");
const buildingSchema = require("../helpers/building.js");

// Create building in the database. At least name is required
exports.createBuilding = async (req, res) => {
  const building = new Building({
    company: req.body.company,
    name: req.body.name,
    address: req.body.address,
    zipcode: req.body.zipcode,
    contact: req.body.contact,
    phone: req.body.phone,
    email: req.body.email,
    obs: req.body.obs,
    boilers: req.body.boilers,
  });

  try {
    await buildingSchema.validateAsync(req.body);
    let doesExist;

    if (building.company !== undefined) {
      doesExist = await Company.findById(building.company);
      if (doesExist === null) {
        return res
          .status(500)
          .send({ msg: `Doesn't exist this company ID: ${building.company}` });
      }
    }

    if (building.boilers !== undefined) {
      doesExist = await Boiler.find({ _id: building.boilers });
      if (doesExist.length === building.boilers.length) {
        doesExist.forEach((boiler) => {
          if (boiler.building !== undefined) {
            return res.status(500).send({
              msg: `This boiler id ${boiler.id} already belongs to a building ${boiler.building}`,
            });
          }
          return false;
        });
      } else {
        return res
          .status(500)
          .send({ msg: `Some of the boilers doesn't exist` });
      }
    }

    await Company.findOneAndUpdate(
      { _id: building.company },
      {
        $push: {
          buildings: building.id,
        },
      },
      { useFindAndModify: false }
    );

    building.save(building);
    return res.send({
      building,
      msg: "Building was successfully created",
    });
  } catch (error) {
    return res.send({ msg: `${error.message}` });
  }
};

// Retrieve all buildings or get building by its attributes from the database.
/*
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
}; */

// Retrieve building by id from the database.
/* exports.getBuildingById = (req, res) => {
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
  return false;
}; */

// Delete building by id from the database.
/* exports.deleteBuildingById = (req, res) => {
  Building.findById(req.params.id)
    .then(() => {
      Boiler.deleteMany({ building: { $in: req.params.id } })
        .then((data) => {
          console.log("Borro Boilers");
          res.send({
            data,
            msg: "Boilers were succesfully deleted",
          });
        })
        .catch((err) => {
          return res.status(500).send({
            msg:
              err.message ||
              "Some error ocurred while removing boilers of building.",
          });
        });
    })
    .then(() => {
      Building.deleteOne({ _id: req.params.id })
        .then((data) => {
          console.log("Borro Building");
          res.send({
            data,
            msg: "Building was succesfully deleted",
          });
        })
        .catch((err) => {
          return res.status(500).send({
            msg: err.message || "Some error ocurred while removing building.",
          });
        });
    })
    .catch((err) => {
      return res.status(500).send({
        msg: err.message || "Some error ocurred while removing building by id.",
      });
    });
  /* .then((data) => {
      Building.delete({ _id: { $in: data._in } })
    }) */
/* Building.findOneAndRemove({ _id: req.params.id }, { useFindAndModify: false })
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
}; */
