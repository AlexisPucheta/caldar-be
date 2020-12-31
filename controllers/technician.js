const Technician = require("../models/technician.js");
const BoilerType = require("../models/boiler-type.js");
const Service = require("../models/service.js");
const technicianSchema = require("../helpers/technician.js");

// Create technician in the database.
exports.createTechnician = async (req, res) => {
  try {
    await technicianSchema.validateAsync(req.body);
    const newTechnician = new Technician({
      services: req.body.services,
      fullname: req.body.fullname,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      dateOfBirth: req.body.dateOfBirth,
      knowledge: req.body.knowledge,
      obs: req.body.obs,
    });

    const technician = await Technician.findOne({
      fullname: newTechnician.fullname,
    });
    if (technician !== null) {
      return res.status(400).send({
        msg: `This technician full name: ${newTechnician.fullname} already exist.`,
      });
    }

    if (newTechnician.services.length !== 0) {
      const services = await Service.find({ _id: newTechnician.services });
      if (services.length === newTechnician.services.length) {
        services.forEach((service) => {
          if (service.technician !== undefined) {
            return res.status(400).send({
              msg: `This service ID: ${service.id} already assigned to technician ${service.technician}.`,
            });
          }
          return false;
        });
        await Service.updateMany(
          { _id: newTechnician.services },
          {
            technician: newTechnician.id,
          }
        );
      } else {
        return res
          .status(404)
          .send({ msg: "Some of the services doesn't exist." });
      }
    }

    if (newTechnician.knowledge.length !== 0) {
      const boilerType = await BoilerType.find({
        boilerType: newTechnician.knowledge,
      });
      if (boilerType.length !== newTechnician.knowledge.length) {
        return res
          .status(404)
          .send({ msg: "Some of the boiler types doesn't exist." });
      }
    }

    await BoilerType.updateMany(
      { boilerType: newTechnician.knowledge },
      {
        $addToSet: {
          technician: newTechnician.id,
        },
      }
    );

    newTechnician.save(newTechnician);
    return res.send({
      newTechnician,
      msg: "New technician was successfully created.",
    });
  } catch (err) {
    return res.status(500).send({
      msg: err.message || "Some error ocurred while creating new technician.",
    });
  }
};

// Retrieve all technicians or get technician by its attributes from the database.
exports.getTechniciansAll = (req, res) => {
  const key = Object.keys(req.query);
  if (JSON.stringify(req.query) === JSON.stringify({})) {
    Technician.find({})
      .then((data) => {
        return res.send(data);
      })
      .catch((err) => {
        return res.status(500).send({
          msg:
            err.message ||
            "Some error ocurred while retrieving all technicians.",
        });
      });
  } else {
    Technician.find(req.query)
      .then((data) => {
        if (Object.keys(data).length !== 0) {
          return res.send(data);
        }
        return res.status(404).send({
          msg: `Doesn't exist any technician with ${key}: ${req.query[key]}.`,
        });
      })
      .catch((err) => {
        return res.status(500).send({
          msg:
            err.message ||
            `Some error ocurred while retrieving technicians by ${key}.`,
        });
      });
  }
};

// Retrieve technician by id from the database.
exports.getTechnicianById = (req, res) => {
  Technician.findById(req.params.id)
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .send({ msg: `Doesn't exist technician with id: ${req.params.id}.` });
      }
      return res.send(data);
    })
    .catch((err) => {
      return res.status(500).send({
        msg:
          err.message ||
          "Some error ocurred while retrieving technician by id.",
      });
    });
};

// Update technician by id in the database.
exports.updateTechnicianById = async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id);
    if (technician === null) {
      return res
        .status(404)
        .send({ msg: `Technician with ID: ${req.params.id} was not found.` });
    }

    await technicianSchema.validateAsync(req.body);
    const updatedTechnician = {
      services: req.body.services,
      fullname: req.body.fullname,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      dateOfBirth: req.body.dateOfBirth,
      knowledge: req.body.knowledge,
      obs: req.body.obs,
    };

    if (updatedTechnician.services !== undefined) {
      const services = await Service.find({ _id: updatedTechnician.services });
      if (services.length === updatedTechnician.services.length) {
        services.forEach((service) => {
          if (
            service.technician !== undefined &&
            service.technician !== req.query.id
          ) {
            return res.status(400).send({
              msg: `This service ID: ${service.id} already assigned to technician ${service.technician}.`,
            });
          }
          return false;
        });
        await Service.updateMany(
          { _id: updatedTechnician.services },
          {
            technician: updatedTechnician.id,
          }
        );
        await Service.updateMany(
          { _id: technician.services },
          {
            technician: null,
          }
        );
      } else {
        return res
          .status(404)
          .send({ msg: "Some of the services doesn't exist." });
      }
    }

    if (
      updatedTechnician.knowledge !== undefined &&
      updatedTechnician.knowledge.length > technician.knowledge.length
    ) {
      const boilerType = await BoilerType.find({
        boilerType: updatedTechnician.knowledge,
      });
      if (boilerType.length !== updatedTechnician.knowledge.length) {
        return res
          .status(404)
          .send({ msg: "Some of the boiler types doesn't exist." });
      }
    }

    await Technician.findByIdAndUpdate(req.params.id, updatedTechnician, {
      useFindAndModify: false,
    });

    await BoilerType.updateMany(
      { boilerType: updatedTechnician.knowledge },
      {
        $addToSet: {
          technician: updatedTechnician.id,
        },
      }
    );

    return res.send({
      technician,
      msg: "Technician was successfully updated.",
    });
  } catch (err) {
    return res.status(500).send({
      msg: err.message || "Some error ocurred while updating technician by ID.",
    });
  }
};

// Delete technician by id from the database.
exports.deleteTechnicianById = async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id);
    if (technician === null) {
      return res
        .status(404)
        .send({ msg: `Technician with ID: ${req.params.id} was not found.` });
    }

    if (technician.services !== undefined) {
      await Service.updateMany(
        { technician: technician.id },
        {
          $unset: {
            technician: "",
          },
        }
      );
    }

    if (technician.knowledge !== undefined) {
      await BoilerType.updateMany(
        { technician: technician.id },
        {
          $pull: {
            technician: technician.id,
          },
        }
      );
    }

    await Technician.deleteOne({ _id: req.params.id });

    return res.send({
      technician,
      msg: `Technician with id: ${req.params.id} was deleted successfully`,
    });
  } catch (err) {
    return res.status(500).send({
      msg: err.message || "Some error ocurred while deleting technician by ID.",
    });
  }
};
