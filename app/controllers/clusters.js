const Cluster = require("../models/cluster.js");
let jwt = require("jsonwebtoken");
let config = require("../../config/database.js");
let middleware = require("../helpers/middleware");
var pass = config.email_pass;
var email = config.email;

// Signup...
exports.create = (req, res) => {
  let emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!req.body.name) {
    return res.status(400).send({
      message: "Name field can not be empty"
    });
  } else if (!req.body.address) {
    return res.status(400).send({
      message: "Address field can not be empty"
    });
  } else if (!req.body.mobile_number ) {
    return res.status(400).send({
      message: "Mobile Number field can not be empty"
    });
  } else if (!req.body.email || !emailReg.test(req.body.email)) {
    return res.status(400).send({
      message: "Email field can not be empty and must be a valid email address"
    });
  }
  Cluster.find({ email: req.body.email }, function(err, docs) {
    if (docs.length) {
      return res.status(409).send({
        message: "Cluster exists already"
      });
    } else {
      const cluster = new Cluster({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        last_name: req.body.last_name,
        address: req.body.address,
        mobile_number: req.body.mobile_number,
        zipcode: req.body.zipcode,
        //    role: req.body.role,
        company_name: req.body.company_name,
        country_id: req.body.country_id,
        state_id: req.body.state_id,
        added_by: req.decoded.userId,
        company_name: req.body.company_name
      });
      // Save cluster in the database
      cluster
        .save()
        .then(data => {
          let token = jwt.sign({ email: req.body.email }, config.secret);
          res.send({
            data: data,
            token: token
          });
        })
        .catch(err => {
          res.status(500).send({
            message: err.message || "Some error occurred while saving the Cluster."
          });
        });
    }
  });
};

//update profile
exports.updateProfile = (req, res) => {
  //console.log(req)
  if (
    req.body.email ||
    req.body.password ||
    req.body.country_id ||
    req.body.state_id
  ) {
    return res.status(403).send({
      message: "Unauthorized update"
    });
  } else if (!req.body.cluster_id) {
    return res.status(400).send({
      message: "Cluster Id field can not be empty"
    });
  } else {
    Object.keys(req.body).forEach(function(key, index) {
      Cluster.findByIdAndUpdate(
        req.body.cluster_id,
        {
          [key]: req.body[key]
        },
        { new: true }
      )
        .then(cluster => {
          if (!cluster) {
            return res.status(404).send({
              message: "Cluster not found with id " + req.body.cluster_id
            });
          }
          res.send(cluster);
        })
        .catch(err => {
          if (err.kind === "ObjectId") {
            return res.status(404).send({
              message: "Cluster not found with id " + req.body.cluster_id
            });
          }
          return res.status(500).send({
            message: "Error updating cluster with id " + req.body.cluster_id
          });
        });
    });
  }
};

// Login
exports.login = (req, res) => {
  let regg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (
    !req.body.password ||
    req.body.password < 8 ||
    !req.body.email ||
    regg.test(req.body.email) === false
  ) {
    return res.status(400).send({
      message: "Invalid Credentials"
    });
  }
  console.log(req.body);
  Cluster.findOne({ email: req.body.email }, function(err, docs) {
    //    console.log(docs)
    if (docs) {  
      docs.comparePassword(req.body.password, function(err, isMatch) {
        if (err) {
          return res.status(400).send({
            message: "Invalid Credentials"
          });
        }
        if (isMatch) {
          let token = jwt.sign(
            {
              clusterId: docs._id.toString(),
              email: req.body.email
            },
            config.secret,
            {
              expiresIn: "480h" // expires in 480 hours
            }
          );
          // return the JWT token for the future API calls
          res.json({
            success: true,
            message: "Authentication successful!",
            token: token,
            data: docs
          });
        } else {
          return res.status(400).send({
            message: "Invalid Credentials"
          });
        }
      });
    } else {
      return res.status(400).send({
        message: "Invalid Credentials"
      });
    }
  });
};
//
exports.findAllPaginated = async (req, res, next) => {
  const pageNo = req.query.page || 1;
  const perPage = 10; 
 if(pageNo < 0 || pageNo === 0) {
  res.status(400).send({
    message: "Invalid Page Number, should start  with 1"
  });
 }
  try {
    const options = {
      page: pageNo,
      limit: perPage,
      sort: { createdAt: -1 },
      collation: {
        locale: "en"
      }
    };

    const clusters = await Cluster.paginate({}, options);
    if (!clusters) {
      const error = new Error("Clusters not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      clusters
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Retrieve and return all clusters from the database.
exports.findAll = (req, res) => {
  Cluster.find()
    .sort("-createdAt")
    .then(clusters => {
      res.send(clusters);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the clusters."
      });
    });
};

exports.findByRole = (req, res) => {
  if (
    !req.body.role
    //       || !Number.isInteger(req.body.zipcode)
  ) {
    return res.status(400).send({
      message: "No role provided"
    });
  }
  Cluster.find({ role: req.body.role })
    .sort("-updatedAt")
    .then(clusters => {
      res.send(clusters);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the admins."
      });
    });
};

// Find a single cluster with a clusterId
exports.findOne = (req, res) => {
  Cluster.findById(req.params.cluster_id)
    .then(cluster => {
      if (!cluster) {
        return res.status(404).send({
          message: "Cluster not found with id " + req.params.cluster_id
        });
      }
      res.send(cluster);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Cluster not found with id " + req.params.cluster_id
        });
      }
      return res.status(500).send({
        message: "Error retrieving cluster with id " + req.params.cluster_id
      });
    });
};

// Delete a cluster with the specified clusterId in the request
exports.delete = (req, res) => {
  Cluster.findByIdAndRemove(req.params.cluster_id)
    .then(cluster => {
      if (!cluster) {
        return res.status(404).send({
          message: "Cluster not found with id " + req.params.cluster_id
        });
      }
      res.send({ message: "Cluster deleted successfully!" });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Cluster not found with id " + req.params.cluster_id
        });
      }
      return res.status(500).send({
        message: "Could not delete Cluster with id " + req.params.cluster_id
      });
    });
};
