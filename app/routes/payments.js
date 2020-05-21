const { body } = require("express-validator");
const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const paymentController = require("../controllers/payments");
const middleware = require("../helpers/middleware");

//GET make payment
router.get("/pay", middleware.checkToken, paymentController.pay);

//GET all payments paginated, superadmin
router.get(
  "/all-payments-paginated",
  middleware.checkRole,
  paymentController.getAllPaymentsPaginated
);

//GET all payments, superadmin
router.get(
  "/all-payments",
  middleware.checkRole,
  categoryController.getAllPayments
);

router.get("/payment/:paymentId", paymentController.getSinglePayment);

//GET update payment status after payment
router.get("/payment-callback", paymentController.paymentCallback);

module.exports = router;
