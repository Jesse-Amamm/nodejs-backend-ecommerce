const State = require("../models/state.js");
let jwt = require("jsonwebtoken");
let config = require("../../config/database.js");
let middleware = require("../helpers/middleware");
var pass = config.email_pass;
var email = config.email;

//
exports.findAllPaginated = async (req, res, next) => {
    const pageNo = req.query.page || 1;
    const perPage = 10; 
    if(pageNo < 0 || pageNo === 0) {
        res.status(400).send({
          message: "Invalid Page Number, should start  with 1"
        });
       }
   const options = {
    page: pageNo,
    limit: perPage,
    sort: { createdAt: -1 },
    find: {country_id: req.body.country_id},
    collation: {
      locale: "en"
    }
  };
  State.paginate({}, options)
   .then(states => {
     res.send(states);
   })
   .catch(err => {
     res.status(500).send({
       message:
         err.message || "Some error occurred while retrieving the states."
     });
   });
  };

// Retrieve and return all states from the database.
exports.findAll = async (req, res, next) => {
    if(!req.body.country_id) {
        res.status(400).send({
            message: "Country id is required"
          });
       }
    State.find({country_id: req.body.country_id})
    .sort({name: 1})
    .then(states => {
      res.send(states);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the states."
      });
    });
  };

// Find a single State with a StateId
exports.findOne = (req, res) => {
  State.findById(req.params.state_id)
    .then(single_state => {
      if (!single_state) {
        return res.status(404).send({
                      message: "State not found with id " + req.params.state_id
        });
      }
      res.send(single_state);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "State not found with id " + req.params.state_id
        });
      }
      return res.status(500).send({
        message: "Error retrieving State with id " + req.params.state_id
      });
    });
};

// Delete a State with the specified StateId in the request
exports.delete = (req, res) => {
  State.findByIdAndRemove(req.params.state_id)
    .then(single_state => {
      if (!single_state) {
        return res.status(404).send({
          message: "State not found with id " + req.params.state_id
        });
      }
      res.send({ message: "State deleted successfully!" });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "State not found with id " + req.params.state_id
        });
      }
      return res.status(500).send({
        message: "Could not delete State with id " + req.params.state_id
      });
    });
};
