const Technician = require("../models/technician.js");
const BoilerType = require("../models/boiler-type.js");
const Service = require("../models/service.js");
const technicianSchema = require("../helpers/technician.js");

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

    await BoilerType.updateMany(
      { boilerType: req.body.knowledge },
      {
        $addToSet: {
          technician: technician.id,
        },
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
exports.updateTechnicianById = async (req, res) => {
  try {
    await technicianSchema.validateAsync(req.body);
    const doc = await Technician.findById(req.params.id);
    const technician = {
      service: req.body.service,
      fullname: req.body.fullname,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      dateOfBirth: req.body.dateOfBirth,
      knowledge: req.body.knowledge,
      obs: req.body.obs,
    };

    if (technician.service !== undefined) {
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

    await Technician.findByIdAndUpdate(req.params.id, technician, {
      useFindAndModify: false,
    });

    await Service.updateMany(
      { technician: req.params.id },
      {
        technician: null,
      },
      { useFindAndModify: false }
    );

    await Service.updateMany(
      { _id: technician.service },
      {
        technician: doc.id,
      },
      { useFindAndModify: false }
    );

    await BoilerType.updateMany(
      { technician: req.params.id },
      {
        $pull: {
          technician: req.params.id,
        },
      },
      { useFindAndModify: false }
    );

    await BoilerType.updateMany(
      { boilerType: req.body.knowledge },
      {
        $addToSet: {
          technician: req.params.id,
        },
      },
      { useFindAndModify: false }
    );

    return res.send(technician);
  } catch (error) {
    return res.send({ msg: `${error.message}` });
  }
};

// Delete technician by id from the database.
exports.deleteTechnicianById = async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id);
    if (technician === null) {
      return res
        .status(500)
        .send({ msg: `This technician ID: ${req.params.id} doesnt exist` });
    }

    await Service.updateMany(
      { technician: technician.id },
      {
        technician: null,
      },
      { useFindAndModify: false }
    );

    await Technician.deleteOne({ _id: req.params.id });

    await BoilerType.updateMany(
      { technician: req.params.id },
      {
        $pull: {
          technician: req.params.id,
        },
      },
      { useFindAndModify: false }
    );

    return res.send({
      msg: `Boiler with id: ${req.params.id} was deleted successfully`,
    });
  } catch (err) {
    return res.send({ msg: err.message || "Error undefined" });
  }
};
