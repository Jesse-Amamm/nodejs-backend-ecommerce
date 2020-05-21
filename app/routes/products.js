const { body } = require("express-validator");

module.exports = (app) => {
  const product = require("../controllers/products.js");
  let middleware = require("../helpers/middleware.js");
  // Create a new Product

  //products should be uploaded by merchant, not superadmin
  app.post("/products", middleware.checkToken, product.create);

  app.get("/products", product.findAll);

  //GET one product
  app.get("/product/:productId", product.getSingleProduct);

  //GET all products for a category
  app.get(
    "/products/category-products/:categoryId",
    product.getProductsByCategoryId
  );

  app.get(
    "/products/product-with-pictures",
    product.getSingleProductWithPictures
  );
  app.get("/products/products-with-pictures", product.getProductsWithPictures);
  app.get("/products/trending", product.getTrendingProducts);
  app.get("/products/top-selections", product.getTopSelections);
  app.get("/products/recommendations", product.getRecommendedProducts);

  //GET paginated products for a category
  app.get(
    "/products/category-products-paginated/:categoryId",
    product.getProductsByCategoryIdPaginated
  );

  app.get("/products-search", product.search);

  app.get("/products-search-paginated", product.searchPaginated);

  app.get("/products-paginated", product.findAllPaginated);

  //PUT update product
  //can only be updated by super admin or creator
  app.put(
    "/product/:productId",
    middleware.checkToken,
    [
      body("name").trim().isLength({ min: 5 }),
      body("description").trim().isLength({ min: 5 }),
    ],
    product.updateProduct
  );
  //can only be updated by superadmin or creator
  app.post(
    "/delete-product/:productId",
    middleware.checkToken,
    product.deleteProduct
  );
};
