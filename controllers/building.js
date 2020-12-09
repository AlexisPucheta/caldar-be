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

    let doc;

    if (building.company !== undefined) {
      doc = await Company.findById(building.company);
      if (doc === null) {
        return res
          .status(500)
          .send({ msg: `Doesn't exist this company ID: ${building.company}` });
      }
    }

    if (building.boilers !== undefined) {
      doc = await Boiler.find({ _id: building.boilers });
      if (doc.length === building.boilers.length) {
        doc.forEach((boiler) => {
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
/* exports.updateBuildingById = async (req, res) => {
  try {
    await buildingSchema.validateAsync(req.body);

    const boiler = {
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

    let doc = await Building.findById(req.params.id);

    if (req.body.building !== undefined) {
      const doesExist = await Building.findById(req.body.building);
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

    doc = await Boiler.findById(req.params.id);
    return res.send(doc);
  } catch (err) {
    return res.send({ msg: `Que paso? ${err}` });
  }
}; */
/* exports.updateBuildingById = (req, res) => {
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
