const Color = require("../models/color.js");
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
    sort: {name: 1},
    collation: {
      locale: "en"
    }
  };
  Color.paginate({}, options)
   .then(colors => {
     res.send(colors);
   })
   .catch(err => {
     res.status(500).send({
       message:
         err.message || "Some error occurred while retrieving the colors."
     });
   });
  };

// Retrieve and return all colors from the database.
exports.findAll = async (req, res, next) => {
    Color.find()
    .sort({name: 1})
    .then(colors => {
      res.send(colors);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the colors."
      });
    });
  };

// Find a single Color with a ColorId
exports.findOne = (req, res) => {
  Color.findById(req.params.color_id)
    .then(single_color => {
      if (!single_color) {
        return res.status(404).send({
                      message: "Color not found with id " + req.params.color_id
        });
      }
      res.send(single_color);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Color not found with id " + req.params.color_id
        });
      }
      return res.status(500).send({
        message: "Error retrieving Color with id " + req.params.color_id
      });
    });
};

// Delete a Color with the specified ColorId in the request
exports.delete = (req, res) => {
  Color.findByIdAndRemove(req.params.color_id)
    .then(single_color => {
      if (!single_color) {
        return res.status(404).send({
          message: "Color not found with id " + req.params.color_id
        });
      }
      res.send({ message: "Color deleted successfully!" });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Color not found with id " + req.params.color_id
        });
      }
      return res.status(500).send({
        message: "Could not delete Color with id " + req.params.color_id
      });
    });
};
