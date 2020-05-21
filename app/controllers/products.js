const Product = require("../models/product.js");
const Picture = require("../models/picture.js");
const User = require("../models/user");
const { validationResult } = require("express-validator");
let jwt = require("jsonwebtoken");
let config = require("../../config/database.js");
let middleware = require("../helpers/middleware");
const roleHelper = require("../helpers/roles");
var pass = config.email_pass;
var email = config.email;

// Create Product...
exports.create = async (req, res) => {
  //console.log(req)
  //product should only uploaded by merchants
  // const userRole = roleHelper.getUserRoles(req.decoded.userId);
  // console.log(JSON.stringify(userRole)+ " a")
  // console.log(roleHelper.getUserRoles(req.decoded.userId)+" b")
  const user = await User.findById(req.decoded.userId);
  if (user.role !== "super-admin") {
    const error = new Error("You are not authorized to create products ");
    error.statusCode = 403;
    throw err;
  }

  if (!req.body.name) {
    return res.status(400).send({
      message: "Name field can not be empty",
    });
  } else if (!req.body.categoryId) {
    return res.status(400).send({
      message: "Category field can not be empty",
    });
  } else if (!req.body.description) {
    return res.status(400).send({
      message: "Description field can not be empty",
    });
  } else if (!req.body.price && isNaN(req.body.price)) {
    return res.status(400).send({
      message: "Price field can not be empty and must be a valid number",
    });
  } else if (!req.body.qty && isNaN(req.body.qty)) {
    return res.status(400).send({
      message: "Quantity field can not be empty and must be a valid number",
    });
  }
  console.log(req.decoded);
  const product = new Product({
    name: req.body.name,
    added_by: req.decoded.userId,
    cluster_id: req.body.cluster_id,
    description: req.body.description,
    price: req.body.price,
    qty: req.body.qty,
    colors: req.body.colors,
    rating: req.body.rating,
    size: req.body.size,
    country_id: req.body.country_id,
    category_id: req.body.categoryId,
    discount_id: req.body.discount_id,
  });
  // Save Product in the database
  product
    .save()
    .then((data) => {
      //   let token = jwt.sign({ email: req.body.email }, config.secret);
      res.send({
        product: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while saving the Product.",
      });
    });
};

exports.findAll = async (req, res, next) => {
  Product.find()
    .sort("-updatedAt")
    .then((products) => {
      res.send(products);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the products.",
      });
    });
};

//
exports.findAllPaginated = async (req, res, next) => {
  const pageNo = req.query.page || 1;
  const perPage = 10;
  if (pageNo < 0 || pageNo === 0) {
    res.status(400).send({
      message: "Invalid Page Number, should start  with 1",
    });
  }
  const options = {
    page: pageNo,
    limit: perPage,
    sort: { createdAt: -1 },
    collation: {
      locale: "en",
    },
  };
  Product.paginate({}, options)
    .then((products) => {
      res.send(products);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the products.",
      });
    });
};

// search for product
exports.search = async (req, res, next) => {
  Product.find({ name: { $regex: req.query.search } })
    .sort("-updatedAt")
    .then((products) => {
      res.send(products);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the products.",
      });
    });
};

exports.searchPaginated = async (req, res, next) => {
  const pageNo = req.query.page || 1;
  const perPage = 10;
  if (pageNo < 0 || pageNo === 0) {
    res.status(400).send({
      message: "Invalid Page Number, should start  with 1",
    });
  }
  const options = {
    page: pageNo,
    limit: perPage,
    sort: { updatedAt: -1 },
    find: { name: { $regex: req.query.search } },
    collation: {
      locale: "en",
    },
  };
  Product.paginate({}, options)
    .then((products) => {
      res.send(products);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the products.",
      });
    });
};

exports.getSingleProduct = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await Picture.findById(productId);
    if (!product) {
      const error = new Error("product not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      product,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.getSingleProductWithPictures = async (req, res, next) => {
  const productId = req.query.id;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error("No product found");
      return next(error);
    }
    //get pictures for product
    const pictures = await Picture.find({ product_id: productId });
    let finalProduct = { ...product._doc, pictures };
    res.status(200).json({ product: finalProduct });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getProductsWithPictures = async (req, res, next) => {
  const products = await Product.find();
  const productLength = products.length;
  let finalProducts = [];

  for (let i = 0; i < productLength; i++) {
    const pictures = await Picture.find({ product_id: products[i]._id });
    let updatedProduct = {
      ...products[i]._doc,
      pictures,
      numberOfPictures: pictures.length,
    };
    finalProducts.push(updatedProduct);
  }

  res.status(200).json({ products: finalProducts });
};

exports.getProductsByCategoryId = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  try {
    const products = await Product.find({ category_id: categoryId });
    if (!products) {
      const error = new Error("no products not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      products,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.getTrendingProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit);
    //TODO modify later with proper algorithm for trending products based on suiting criteria
    const products = await Product.find().limit(limit);
    const productLength = products.length;
    let finalProducts = [];

    for (let i = 0; i < productLength; i++) {
      const pictures = await Picture.find({ product_id: products[i]._id });
      let updatedProduct = {
        ...products[i]._doc,
        pictures,
        numberOfPictures: pictures.length,
      };
      finalProducts.push(updatedProduct);
    }

    res.status(200).json({ products: finalProducts });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getTopSelections = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit);
    //TODO modify later with proper algorithm for top products based on suiting criteria
    const products = await Product.find().limit(limit);
    const productLength = products.length;
    let finalProducts = [];

    for (let i = 0; i < productLength; i++) {
      const pictures = await Picture.find({ product_id: products[i]._id });
      let updatedProduct = {
        ...products[i]._doc,
        pictures,
        numberOfPictures: pictures.length,
      };
      finalProducts.push(updatedProduct);
    }

    res.status(200).json({ products: finalProducts });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getRecommendedProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit);
    //TODO modify later with proper algorithm for recommended products based on suiting criteria
    const products = await Product.find().limit(limit);
    const productLength = products.length;
    let finalProducts = [];

    for (let i = 0; i < productLength; i++) {
      const pictures = await Picture.find({ product_id: products[i]._id });
      let updatedProduct = {
        ...products[i]._doc,
        pictures,
        numberOfPictures: pictures.length,
      };
      finalProducts.push(updatedProduct);
    }

    res.status(200).json({ products: finalProducts });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getProductsByCategoryIdPaginated = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  const currentPage = req.query.page || 1;
  const perPage = 10; //number of of items to display for per page

  try {
    const options = {
      page: currentPage,
      limit: perPage,
      sort: { createdAt: -1 },
      collation: {
        locale: "en",
      },
    };
    const products = await Product.paginate(
      { category_id: categoryId },
      options
    );
    if (!products) {
      const error = new Error("products not found");
      error.statusCode = 404;
      next(error);
    }
    res.status(200).json({
      products: products,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  const productId = req.params.productId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed. Check the data submitted");
    error.statusCode = 422;
    return next(error);
  }

  const name = req.body.name;
  const description = req.body.description;
  const price = req.body.price;
  const qty = req.body.qty;
  const category_id = req.body.category_id;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error("product not found");
      error.statusCode = 404;
      return next(error);
    }
    //product found

    //product can only be edited by creator or super admin
    const userRole = roleHelper.getUserRoles(req.decoded.userId);
    if (
      product.added_by.toString() !== req.decoded.userId &&
      (userRole !== "super-admin" || userRole !== "admin")
    ) {
      const error = new Error("You are not authorized to update this product");
      error.statusCode = 403;
      return next(error);
    }

    product.name = name;
    product.description = description;
    product.price = price;
    product.qty = qty;
    product.category_id = category_id;

    const result = await product.save();
    res.status(200).json({ message: "product updated successfully", product });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error("product not found");
      error.statusCode = 404;
      return next(error);
    }

    //product can only be deleted by creator or super admin
    const userRole = roleHelper.getUserRoles(req.decoded.userId);
    if (
      product.added_by.toString() !== req.decoded.userId &&
      (userRole !== "super-admin" || userRole !== "admin")
    ) {
      const error = new Error("You are not authorized to delete this product");
      error.statusCode = 403;
      return next(error);
    }

    //delete
    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: "product successfully deleted", product });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
