const Building = require("../models/building.js");
const Company = require("../models/company.js");
const Boiler = require("../models/boiler.js");
const buildingSchema = require("../helpers/building.js");

// Create building in the database. At least name is required
exports.createBuilding = async (req, res) => {
  try {
    await buildingSchema.validateAsync(req.body);

    const newBuilding = new Building({
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

    if (newBuilding.company !== undefined) {
      const company = await Company.findById(newBuilding.company);
      if (company === null) {
        return res.status(404).send({
          msg: `Doesn't exist this company ID: ${newBuilding.company}.`,
        });
      }
      await Company.updateOne(
        { _id: newBuilding.company },
        {
          $push: {
            buildings: newBuilding.id,
          },
        }
      );
    }

    if (newBuilding.boilers !== undefined) {
      const boilers = await Boiler.find({ _id: newBuilding.boilers });
      if (boilers.length === newBuilding.boilers.length) {
        boilers.forEach((boiler) => {
          if (boiler.building !== undefined) {
            return res.status(500).send({
              msg: `This boiler id ${boiler.id} already belongs to a building ${boiler.building}.`,
            });
          }
          return false;
        });
        await Boiler.updateMany(
          { _id: newBuilding.boilers },
          {
            building: newBuilding.id,
          }
        );
      } else {
        return res
          .status(404)
          .send({ msg: "Some of the boilers doesn't exist." });
      }
    }

    newBuilding.save(newBuilding);
    return res.send({
      newBuilding,
      msg: "New building was successfully created.",
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
    let building = await Building.findById(req.params.id);

    if (building === null) {
      return res
        .status(404)
        .send({ msg: `Building with ID: ${req.params.id} was not found.` });
    }

    await buildingSchema.validateAsync(req.body);

    const updatedBuilding = {
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

    if (updatedBuilding.company !== undefined) {
      const company = await Company.findById(updatedBuilding.company);
      if (company === null) {
        return res.status(404).send({
          msg: `Doesn't exist this company ID: ${updatedBuilding.company}.`,
        });
      }
    }

    if (updatedBuilding.boilers !== undefined) {
      const boilers = await Boiler.find({ _id: updatedBuilding.boilers });
      if (boilers.length !== updatedBuilding.boilers.length) {
        return res
          .status(404)
          .send({ msg: "Some of the boilers doesn't exist." });
      }
    }

    await Building.findByIdAndUpdate(req.params.id, updatedBuilding, {
      useFindAndModify: false,
    });

    await Company.updateOne(
      { _id: updatedBuilding.company },
      {
        $addToSet: {
          building: req.params.id,
        },
      }
    );

    await Boiler.updateMany(
      { _id: updatedBuilding.boilers },
      {
        building: req.params.id,
      }
    );

    building = await Building.findById(req.params.id);

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
