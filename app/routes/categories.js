const { body } = require("express-validator");
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categories");
const middleware = require("../helpers/middleware");

//GET all categories with pagination
router.get(
  "/all-categories-paginated",
  categoryController.getAllCategoriesPaginated
);
//GET all categories
router.get("/all-categories", categoryController.getAllCategories);

router.get(
  "/limited-categories-with-products",
  categoryController.getLimitedCategoriesWithProducts
);

router.get(
  "/categories-with-products",
  categoryController.getCategoriesWithProducts
);

//POST create categories
//can only be created by super admin
router.post(
  "/category",
  middleware.checkRole,
  [
    body("name")
      .trim()
      .isLength({ min: 5 })
  ],
  categoryController.createCategory
);

//PUT update categories
//can only be updated by super admin or creator
router.put(
  "/category/:categoryId",
  middleware.checkToken,
  [
    body("name")
      .trim()
      .isLength({ min: 5 }),
    body("description")
      .trim()
      .isLength({ min: 5 })
  ],
  categoryController.updateCategory
);
//GET single categorY
router.get("/category/:categoryId", categoryController.getSingleCategory);

//can only be updated super admin or creator
router.post(
  "/delete-category/:categoryId",
  middleware.checkToken,
  categoryController.deleteCategory
);

module.exports = router;
