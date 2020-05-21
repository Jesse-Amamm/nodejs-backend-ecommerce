const express = require("express");
const bodyParser = require("body-parser");
const { errorHandler } = require("./app/helpers/error-handler");
var cors = require("cors");

// create express app
const app = express();
app.use(cors());
// app.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', 'https://localhost:9000');
//     res.header(
//       'Access-Control-Allow-Headers',
//       'Origin, X-Requested-With, Content-Type, Accept'
//     );
//     next();
//   });

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());
// Configuring the database
const dbConfig = require("./config/database.js");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose
  .connect(dbConfig.db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch(err => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

// define a simple route
app.get("/", (req, res) => {
  res.json({ message: "--- Connection Successful! ---" });
});

//import routes
// const cartRoutes = require('./app/routes/cart.js');
const categoriesRoutes = require("./app/routes/categories.js");
// const clustersRoutes = require('./app/routes/clusters.js');
require("./app/routes/colors.js")(app);
require("./app/routes/countries.js")(app);
// const discountsRoutes = require('./app/routes/discounts.js');
// const paymentTypesRoutes = require('./app/routes/paymentTypes.js');
const picturesRoutes = require("./app/routes/pictures.js");
require("./app/routes/products.js")(app);
// const reviewsRoutes = require('./app/routes/reviews.js');
// const shippingRoutes = require('./app/routes/shipping.js');
// const shippingMethodsRoutes = require('./app/routes/shippingMethods.js');
require("./app/routes/states.js")(app);
// const subCategoriesRoutes = require('./app/routes/subCategories.js');
// const transactionsRoutes = require('./app/routes/transactions.js');
require("./app/routes/users.js")(app);

//define custom routes
// app.use('/cart', adminRoutes);
app.use("/categories", categoriesRoutes);
// app.use('/clusters', clustersRoutes);
// app.use('/colors', colorsRoutes);
//app.use('/countries', countriesRoutes);
// app.use('/discounts', discountsRoutes);
// app.use('/payment-types', paymentTypesRoutes);
app.use("/pictures", picturesRoutes);
//app.use('/product', productsRoutes);
// app.use('/reviews', reviewsRoutes);
// app.use('/shipping', shippingRoutes);
// app.use('/shipping-methods', shippingMethodsRoutes);
// app.use('/states', statesRoutes);
// app.use('/sub-categories', subCategoriesRoutes);
// app.use('/transactions', transactionsRoutes);
//app.use("/users", usersRoutes);

//default error handling. See categories getAllCategories endpoint for sample usage. Call next() on error to forward to default error handler outside a promise or try block
app.use(errorHandler);

// listen for requests

app.listen(process.env.PORT || dbConfig.port, () => {
  console.log(
    `Server is listening on port ${
      process.env.PORT ? process.env.PORT : dbConfig.port
    }...`
  );
});
