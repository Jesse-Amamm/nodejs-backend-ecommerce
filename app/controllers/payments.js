const Cryptr = require("cryptr");
const util = require("util"); //console.log(util.inspect([variable], false, null, true));
const Payment = require("../models/payment");
const orobopayClient = require("../helpers/oroboPay/client");
const config = require("../../config/config-env").variables;

const generatePaymentReference = () => {
  let date = new Date();
  const year = date.getFullYear;
  const month = date.getMonth();
  const day = date.getDay;
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const reference = `PMTREF/${day}${year}${month}${hour}/${minute}${second}`;

  return reference;
};

exports.pay = async (req, res, next) => {
  const cryptr = new Cryptr(process.env.POST_DATA_ENCRYPTION_KEY); //DEBUG ensure that env is working

  //decrypt encrypted post data
  const rq = cryptr.decrypt(request.body);

  const amount = rq.amount;
  const pan = rq.pan;
  const expiryMonth = rq.expiryMonth;
  const expiryYear = rq.expiryYear;
  const cvv = rq.cvv;
  const cartId = req.cartId;
  const payerName = rq.request.payerName;
  const payerEmailAddress = rq.request.payerEmailAddress;
  const payerPhoneNumber = rq.request.payerPhoneNumber;
  const paymentReference = generatePaymentReference();
  const redirectUrl = `${config.redirect_url}/payment-callback?paymentref=${paymentReference}`;

  const option = {
    amount: amount,
    paymentReference: paymentReference,
    pan: pan,
    expiryMonth: expiryMonth,
    expiryYear: expiryYear,
    cvv: cvv,
    redirectUrl: redirectUrl,
    payerName: payerName,
    payerEmail: payerEmailAddress,
    payerPhoneNumber: payerPhoneNumber
  };

  const userId = req.decoded.userId;

  //check if incomplete payment exists for the particular cart. returns the record if so
  let incompletePaymentRecordExistsForCart = incompletePaymentRecordExistsForCart(
    userId,
    cartId
  );

  //if so, update the amount in the payment and the payment reference
  if (incompletePaymentRecordExistsForCart) {
    try {
      const payment = incompletePaymentRecordExistsForCart;
      payment.payment_reference = paymentReference;
      payment.amount = amount;

      await payment.save();
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
        return next(error);
      }
    }
  } else {
    //otherwise create a new payment record
    try {
      //save payment, only proceed if payment is successfully saved
      const payment = new Payment({
        name: "SADE order payment",
        user_id: userId,
        cart_id: cartId,
        payment_reference: paymentReference,
        amount: amount
      });
      await payment.save();
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
        next(err);
      }
    }
  }

  //saved successfully then procees to payment
  //initiate orobopay
  const accountPaymentMethod = orobopayClient.getAccountsPaymentMethod();
  if (
    accountPaymentMethod.PayLoad.status == true &&
    accountPaymentMethod.PayLoad.data.methods[0].code === "CARD"
  ) {
    const paymentResponse = orobopayClient.createPaymentRequest(option);
    if (paymentResponse.PayLoad.data.redirect === true) {
      //web payment
      //return payment url
      res.status(200).json({
        paymentUrl: paymentResponse.PayLoad.data.payment_url,
        message: "Please visit the payment url to complete payment"
      });
    } else {
      //host to host payment maybe
      //for now host to host not configured, best of victor's knowlesge
      res.status(500).json({
        message:
          "Host to host payments not configured at this time. Please try again later"
      });
    }
  } else {
    const error = new Error(
      "Card payments are currently not allowed on the platform. Please try again."
    );
    error.statusCode = 500;
    next(error);
  }
};

exports.paymentCallback = async (req, res, next) => {
  const paymentReference = req.query.paymentref;

  //query orobo to see if payment completed, update if so,
  const response = orobopayClient.paymentRequestStatus(paymentReference);
  if (
    response.PayLoad.status === true &&
    response.PayLoad.data.payment_status === "success"
  ) {
    //confirm and update
    try {
      const paymentRecord = await Payment.find({
        paymentReference: paymentReference
      });
      if (!paymentRecord) {
        const error = new Error("Payment record not found");
        error.statusCode = 404;
        return next(error);
      }
      //payment record found
      paymentRecord.completed = true;
      await paymentRecord.save();

      //TODO move cart information to order
      res.status(200).json({ message: "Payment completed successfully" });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
        next(err);
      }
    }
  } else {
    res.status(500).json({ message: "Payment incomplete" });
  }
};

exports.getAllPaymentsPaginated = async (req, res, next) => {
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
    const payments = await Payment.paginate({}, options);
    if (!payments) {
      const error = new Error("Payments not found");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      payments: payments
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAllPayments = async (req, res, next) => {
  try {
    const payments = Payment.find().sort({ createdAt: -1 });
    if (!payments) {
      const error = new Error("Payments not found");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      payments
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//categoryId is expected in request param
exports.getSinglePayment = async (req, res, next) => {
  const paymentId = req.params.paymentId;
  try {
    const payment = Payment.findById(paymentId);
    if (!payment) {
      const error = new Error("Payment not found");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      payment
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

const incompletePaymentRecordExistsForCart = async (userId, cartId) => {
  try {
    result = await Payment.find({
      userId: userId,
      cart_id: cartId,
      completed: false
    });
    if (!result) {
      return false;
    } else {
      return result;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      return next(error);
    }
  }
};
