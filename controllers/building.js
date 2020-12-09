const Building = require("../models/building.js");
const Company = require("../models/company.js");
const Boiler = require("../models/boiler.js");
const buildingSchema = require("../helpers/building.js");

// Create building in the database. At least name is required
exports.createBuilding = async (req, res) => {
  try {
    await buildingSchema.validateAsync(req.body);

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

    if (building.company !== undefined) {
      const company = await Company.findById(building.company);
      if (company === null) {
        return res
          .status(500)
          .send({ msg: `Doesn't exist this company ID: ${building.company}` });
      }
    }

    if (building.boilers !== undefined) {
      const boilers = await Boiler.find({ _id: building.boilers });
      if (boilers.length === building.boilers.length) {
        boilers.forEach((boiler) => {
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
  } catch (err) {
    return res.status(500).send({
      msg: err.message || "Some error ocurred while creating new building.",
    });
  }
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
exports.updateBuildingById = async (req, res) => {
  try {
    await buildingSchema.validateAsync(req.body);

    const newBuilding = {
      company: req.body.company,
      name: req.body.name,
      address: req.body.address,
      zipcode: req.body.zipcode,
      contact: req.body.contact,
      phone: req.body.phone,
      email: req.body.email,
      obs: req.body.obs,
      boilers: req.body.boilers,
    };

    if (req.body.company !== undefined) {
      const company = await Company.findById(req.body.company);
      if (company === null) {
        return res
          .status(404)
          .send({ msg: `Doesn't exist this company ID: ${req.body.company}` });
      }
    }

    if (req.body.boilers !== undefined) {
      const boilers = await Boiler.find({ _id: req.body.boilers });
      if (boilers.length !== req.body.boilers.length) {
        return res
          .status(404)
          .send({ msg: `Some of the boilers doesn't exist` });
      }
    }

    await Building.findByIdAndUpdate(req.params.id, newBuilding, {
      useFindAndModify: false,
    });

    await Boiler.updateMany(
      { _id: newBuilding.boilers },
      {
        building: req.params.id,
      },
      { useFindAndModify: false }
    );

    await Company.updateOne(
      { _id: newBuilding.company },
      {
        $addToSet: {
          building: req.params.id,
        },
      },
      { useFindAndModify: false }
    );

    const building = await Building.findById(req.params.id);
    return res.send({
      building,
      msg: "Building was successfully updated.",
    });
  } catch (err) {
    return res.status(500).send({
      msg: err.message || "Some error ocurred while updating building by ID.",
    });
  }
};

// Delete building by id from the database.
exports.deleteBuildingById = async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);

    if (building !== null) {
      if (building.company !== undefined) {
        await Company.findOneAndUpdate(
          { _id: building.company },
          {
            $pull: {
              buildings: req.params.id,
            },
          },
          { useFindAndModify: false }
        );
      }

      if (building.boilers !== undefined) {
        await Boiler.deleteMany({ building: req.params.id });
      }

      await Building.deleteOne({ _id: req.params.id });

      return res.send({
        building,
        msg: `Building with ID: ${req.params.id} was successfully deleted.`,
      });
    }
    return res
      .status(404)
      .send({ msg: `Building with ID: ${req.params.id} was not found.` });
  } catch (err) {
    return res.status(500).send({
      msg: err.message || "Some error ocurred while deleting building by ID.",
    });
  }
};
