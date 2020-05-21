const Country = require("../models/country.js");
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
    collation: {
      locale: "en"
    }
  };
  Country.paginate({}, options)
   .then(countries => {
     res.send(countries);
   })
   .catch(err => {
     res.status(500).send({
       message:
         err.message || "Some error occurred while retrieving the countries."
     });
   });
  };

// Retrieve and return all Countries from the database.
exports.findAll = async (req, res, next) => {
    Country.find()
    .sort("-createdAt")
    .then(countries => {
      res.send(countries);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the countries."
      });
    });
  };

// Find a single Country with a CountryId
exports.findOne = (req, res) => {
  Country.findById(req.params.country_id)
    .then(single_country => {
      if (!single_country) {
        return res.status(404).send({
                      message: "Country not found with id " + req.params.country_id
        });
      }
      res.send(single_country);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Country not found with id " + req.params.country_id
        });
      }
      return res.status(500).send({
        message: "Error retrieving Country with id " + req.params.country_id
      });
    });
};

// Delete a Country with the specified CountryId in the request
exports.delete = (req, res) => {
  Country.findByIdAndRemove(req.params.country_id)
    .then(single_country => {
      if (!single_country) {
        return res.status(404).send({
          message: "Country not found with id " + req.params.country_id
        });
      }
      res.send({ message: "Country deleted successfully!" });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Country not found with id " + req.params.country_id
        });
      }
      return res.status(500).send({
        message: "Could not delete Country with id " + req.params.country_id
      });
    });
};
