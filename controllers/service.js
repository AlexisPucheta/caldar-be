const Service = require("../models/service.js");
const Boiler = require("../models/boiler.js");
const Technician = require("../models/technician.js");
const serviceSchema = require("../helpers/service.js");

// Create service in the database.
exports.createService = async (req, res) => {
  try {
    await serviceSchema.validateAsync(req.body);
    const newService = new Service({
      boiler: req.body.boiler,
      technician: req.body.technician,
      status: req.body.status,
      priority: req.body.priority,
      type: req.body.type,
      agreedDate: req.body.agreedDate,
      openedDate: req.body.openedDate,
      closingDate: req.body.closingDate,
      details: req.body.details,
    });

    const boiler = await Boiler.findById(newService.boiler);
    if (boiler === null) {
      return res.status(404).send({
        msg: `Doesn't exist this boiler ID: ${newService.boiler}.`,
      });
    }

    if (newService.technician !== undefined) {
      const technician = await Technician.findById(newService.technician);
      if (technician === null) {
        return res.status(404).send({
          msg: `Doesn't exist this technician ID: ${newService.technician}.`,
        });
      }
      await Technician.updateOne(
        { _id: newService.technician },
        {
          $push: {
            services: newService.id,
          },
        }
      );
    }

    newService.save(newService);
    return res.send({
      newService,
      msg: "New service was successfully created.",
    });
  } catch (err) {
    return res.status(500).send({
      msg: err.message || "Some error ocurred while creating new service.",
    });
  }
};

// Retrieve all services or get service by its attributes from the database.
exports.getServicesAll = (req, res) => {
  const key = Object.keys(req.query);
  if (JSON.stringify(req.query) === JSON.stringify({})) {
    Service.find({})
      .then((data) => {
        return res.send(data);
      })
      .catch((err) => {
        return res.status(500).send({
          msg:
            err.message || "Some error ocurred while retrieving all services.",
        });
      });
  } else {
    Service.find(req.query)
      .then((data) => {
        if (Object.keys(data).length !== 0) {
          return res.send(data);
        }
        return res.status(404).send({
          msg: `Doesn't exist any service with ${key}: ${req.query[key]}.`,
        });
      })
      .catch((err) => {
        return res.status(500).send({
          msg:
            err.message ||
            `Some error ocurred while retrieving service by ${key}.`,
        });
      });
  }
};

// Retrieve service by id from the database.
exports.getServiceById = (req, res) => {
  Service.findById(req.params.id)
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .send({ msg: `Doesn't exist service with id: ${req.params.id}.` });
      }
      return res.send(data);
    })
    .catch((err) => {
      return res.status(500).send({
        msg:
          err.message || "Some error ocurred while retrieving service by id.",
      });
    });
};

// Update service by id in the database.
exports.updateServiceById = async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);
    if (service === null) {
      return res
        .status(404)
        .send({ msg: `Service with ID: ${req.params.id} was not found.` });
    }

    await serviceSchema.validateAsync(req.body);
    const updatedService = {
      boiler: req.body.boiler,
      technician: req.body.technician,
      status: req.body.status,
      priority: req.body.priority,
      type: req.body.type,
      agreedDate: req.body.agreedDate,
      openedDate: req.body.openedDate,
      closingDate: req.body.closingDate,
      details: req.body.details,
    };

    const boiler = await Boiler.findById(updatedService.boiler);
    if (boiler === null) {
      return res.status(404).send({
        msg: `Doesn't exist this boiler ID: ${updatedService.boiler}.`,
      });
    }

    if (updatedService.technician !== undefined) {
      const technician = await Technician.findById(updatedService.technician);
      if (technician === null) {
        return res.status(404).send({
          msg: `Doesn't exist this technician ID: ${updatedService.technician}.`,
        });
      }
    }

    await Service.findByIdAndUpdate(req.params.id, updatedService, {
      useFindAndModify: false,
    });

    await Technician.updateOne(
      { _id: service.technician },
      {
        $pull: {
          services: service.id,
        },
      }
    );

    await Technician.updateOne(
      { _id: updatedService.technician },
      {
        $push: {
          services: updatedService.id,
        },
      }
    );

    service = await Service.findById(req.params.id);

    return res.send({
      service,
      msg: "Service was successfully updated.",
    });
  } catch (err) {
    return res.status(500).send({
      msg: err.message || "Some error ocurred while updating service by ID.",
    });
  }
};

// Delete service by id from the database.
exports.deleteServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (service === null) {
      return res
        .status(404)
        .send({ msg: `This service ID: ${req.params.id} doesnt exist` });
    }

    await Boiler.findOneAndUpdate(
      { _id: service.boiler },
      {
        $pull: {
          services: req.params.id,
        },
      },
      { useFindAndModify: false }
    );

    if (service.technician !== undefined) {
      await Technician.findOneAndUpdate(
        { _id: service.technician },
        {
          $pull: {
            services: req.params.id,
          },
        },
        { useFindAndModify: false }
      );
    }

    await Service.deleteOne({ _id: req.params.id });

    return res.send({
      service,
      msg: `Service with id: ${req.params.id} was successfully deleted.`,
    });
  } catch (err) {
    return res.status(500).send({
      msg: err.message || "Some error ocurred while deleting service by ID.",
    });
  }
};
