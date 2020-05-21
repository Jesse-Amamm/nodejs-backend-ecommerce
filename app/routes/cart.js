module.exports = app => {
  const cart = require("../controllers/cart.js");
  let middleware = require("../helpers/middleware.js");
  // Add to Cart
  app.post("/add-cart", middleware.checkToken, cart.add);
  // Remove from Cart
  app.post("/remove-cart", middleware.checkToken, cart.remove);
  // Get usercart
  app.post("/get-user-cart", middleware.checkToken, cart.getCart);
};
