const { validationResult } = require("express-validator");
const Category = require("../models/category");
const Product = require("../models/product");
const roleHelper = require("../helpers/roles");

exports.getAllCategoriesPaginated = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 10; //number of of items to display for per page

  try {
    const options = {
      page: currentPage,
      limit: perPage,
      sort: { createdAt: -1 },
      collation: {
        locale: "en"
      }
    };
    const categories = await Category.paginate({}, options);
    if (!categories) {
      const error = new Error("Categories not found");
      error.statusCode = 404;
      next(error);
    }
    res.status(200).json({
      categories: categories
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    if (!categories) {
      const error = new Error("Categories not found");
      error.statusCode = 404;
      next(error);
    }
    res.status(200).json({
      categories: categories
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getCategoriesWithProducts = async (req, res, next) => {
  const categories = await Category.find();
  const catLength = categories.length;
  let finalCategories = [];

  for (let i = 0; i < catLength; i++) {
    const products = await Product.find({ category_id: categories[i]._id });
    let updatedCategory = {
      ...categories[i]._doc,
      products,
      numberOfProducts: products.length
    };
    finalCategories.push(updatedCategory);
  }

  res.status(200).json({ categories: finalCategories });
};

exports.getLimitedCategoriesWithProducts = async (req, res, next) => {
  const limit = parseInt(req.query.limit);

  const categories = await Category.find().limit(limit);
  const catLength = categories.length;
  let finalCategories = [];

  for (let i = 0; i < catLength; i++) {
    const products = await Product.find({ category_id: categories[i]._id });
    let updatedCategory = {
      ...categories[i]._doc,
      products,
      numberOfProducts: products.length
    };
    finalCategories.push(updatedCategory);
  }

  res.status(200).json({ categories: finalCategories });

  //CALLBACK HELL
  // let categoriesWithProducts = categories.map(async (category, index) => {
  //   let products = await Product.find({ category_id: category._id });
  //   let newCategory = { ...category._doc, products };
  //   //console.log(newCategory);
  //   return newCategory

  // });

  //res.status(200).json({ categories: categoriesWithProducts });

  // await Category.find()
  //   .populate("products")
  //   .limit(limit)
  //   .exec(function(error, results) {
  //     /* `results.products` is now an array of instances of `Product` */
  //     console.log(results);
  //     res.status(200).json({ results });
  //   });
};

//categoryId is expected in request param
exports.getSingleCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      next(error);
    }
    res.status(200).json({
      category
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

exports.createCategory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    // console.log(errors.array());

    error.statusCode = 422;
    return next(error);
  }

  //validation passed
  const name = req.body.name;
  const added_by = req.decoded.userId;
  // const added_by = "testuserid12";
  const description = req.body.description;

  const category = new Category({
    name: name,
    added_by: added_by,
    description: description
  });

  try {
    await category.save();
    res.status(201).json({
      message: "Category created successfullly",
      category: category
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed. Check the data submitted");
    error.statusCode = 422;
    return next(error);
  }

  const name = req.body.name;
  const description = req.body.description;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      return next(error);
    }
    //category found

    //category can only be edited by creator or super admin
    const userRole = roleHelper.getUserRoles(req.decoded.userId);
    if (
      category.added_by.toString() !== req.decoded.userId &&
      (userRole !== "super-admin" || userRole !== "admin")
    ) {
      const error = new Error("You are not authorized to update this category");
      error.statusCode = 403;
      return next(error);
    }

    category.name = name;
    category.description = description;

    const result = await category.save();
    res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.deleteCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      return next(error);
    }

    //category can only be deleted by creator or super admin
    const userRole = roleHelper.getUserRoles(req.decoded.userId);
    if (
      category.added_by.toString() !== req.decoded.userId &&
      (userRole !== "super-admin" || userRole !== "admin")
    ) {
      const error = new Error("You are not authorized to delete this category");
      error.statusCode = 403;
      return next(error);
    }

    //delete
    await Category.findByIdAndDelete(categoryId);
    res
      .status(200)
      .json({ message: "Category successfully deleted", category });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
