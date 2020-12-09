const Service = require("../models/service.js");
// const serviceSchema = require("../helpers/service.js");

// Retrieve all technicians or get technician by its attributes from the database.
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
