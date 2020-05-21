module.exports = app => {
  const user = require("../controllers/users.js");
  let middleware = require("../helpers/middleware.js");
  // Create a new Note
  app.post("/users", user.create);

  app.post("/login", user.login);

  // Retrieve all Users -superadmin
  app.get("/users", middleware.checkRole, user.findAll);

  // Retrieve all UsersPaginated -superadmin
  app.get("/users-paginated", middleware.checkRole, user.findAllPaginated);

  // Retrieve users by roles -superadmin
  app.post("/roles", middleware.checkRole, user.findByRole);

  // Retrieve a single user with user_id
  app.get("/users/:user_id", middleware.checkToken, user.findOne);

  // Delete a user
  app.delete("/users/:user_id", middleware.checkRole, user.delete);

  //Get captcha
  app.get("/get-captcha", user.getCaptcha);

  //Verify account
  app.get(
    "/verify-account/:user_id",
    middleware.checkToken,
    user.verifyAccount
  );

  //Complete verification
  app.get(
    "/complete-verification/:verification_code",
    user.completeVerification
  );
};
