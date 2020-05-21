let jwt = require("jsonwebtoken");
const config = require("../../config/database.js");
const User = require("../models/user");

let checkToken = (req, res, next) => {
  console.log(req.headers);
  let token =
    req.headers["x-access-token"] || req.headers["authorization"] || null; // Express headers are auto converted to lowercase
  if (token) {
    if (token.startsWith("Bearer ")) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }
  } else {
    return res.status(401).send({
      message: "Token is not valid"
    });
  }

  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Token is not valid"
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(401).send({
      message: "Token is not valid"
    });
  }
};
let checkRole = (req, res, next) => {
  console.log(req.headers);
  let token =
    req.headers["x-access-token"] || req.headers["authorization"] || null; // Express headers are auto converted to lowercase
  if (token) {
    if (token.startsWith("Bearer ")) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }
  } else {
    return res.status(401).send({
      message: "Token is not valid"
    });
  }

  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Token is not valid"
        });
      } else {
        req.decoded = decoded;
        User.find({ email: decoded.email }, function(err, docs) {
          if (docs.length) {
            if (docs[0].role !== "super-admin") {
              console.log(docs);
              return res.status(403).send({
                message: "Unauthorized"
              });
            } else {
              next();
            }
          } else {
            return res.status(403).send({
              message: "Unauthorized"
            });
          }
        });
      }
    });
  } else {
    return res.status(401).send({
      message: "Token is not valid"
    });
  }
};

module.exports = {
  checkToken: checkToken,
  checkRole: checkRole
};
