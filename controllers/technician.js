const Technician = require("../models/technician.js");
const technicianSchema = require("../helpers/technician.js");
const BoilerType = require("../models/boiler-type.js");
const Service = require("../models/service.js");

// Create technician in the database.
exports.createTechnician = async (req, res) => {
  try {
    await technicianSchema.validateAsync(req.body);

    const technician = new Technician({
      service: req.body.service,
      fullname: req.body.fullname,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      dateOfBirth: req.body.dateOfBirth,
      knowledge: req.body.knowledge,
      obs: req.body.obs,
    });

    if (technician.service.length !== 0) {
      const doesExist = await Service.findById(technician.service);
      if (doesExist === null) {
        return res.status(500).send({
          msg: `Doesn't exist this service ID: ${technician.service}`,
        });
      }
    }

    if (technician.knowledge !== undefined) {
      const boilerType = await BoilerType.find({
        boilerType: technician.knowledge,
      });
      if (boilerType.length !== technician.knowledge.length) {
        return res.status(500).send({
          msg: `Doesn't exist some of this boiler-type: ${technician.knowledge}`,
        });
      }
    }

    await Service.updateMany(
      { _id: technician.service },
      {
        technician: technician.id,
      },
      { useFindAndModify: false }
    );

    technician.save();
    return res.send(technician);
  } catch (error) {
    return res.send({ msg: `${error.message}` });
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
exports.updateTechnicianById = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ msg: "Data to update cannot be empty" });
  }
  if (
    !req.body.full_name ||
    !req.body.phone ||
    !req.body.birthday ||
    !req.body.email ||
    !req.body.boilers ||
    !req.body.types
  ) {
    return res.status(400).send({ msg: "Content cannot be empty" });
  }

  Technician.findOneAndUpdate({ _id: req.params.id }, req.body, {
    useFindAndModify: false,
  })
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .send({ msg: `Technician with id: ${req.params.id} was no found` });
      }
      return res.send({
        data,
        msg: `Technician with id=${req.params.id} was successfully updated.`,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        msg:
          err.message || "Some error ocurred while updating technician by id.",
      });
    });
  return undefined;
};

// Delete technician by id from the database.
exports.deleteTechnicianById = (req, res) => {
  Technician.findOneAndRemove(
    { _id: req.params.id },
    { useFindAndModify: false }
  )
    .then((data) => {
      res.send({
        data,
        msg: `Technician with id: ${req.params.id} was succesfully deleted.`,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        msg:
          err.message || "Some error ocurred while removing technician by id.",
      });
    });
};
