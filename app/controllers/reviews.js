const { validationResult } = require("express-validator");
const Review = require("../models/review");
const Order = require("../models/order");

exports.getProductReviewsPaginated = async (req, res, next) => {
  const productId = req.params.productId;

  const currentPage = req.query.page || 1;
  const perPage = 10; //number of of items to display for per page

  try {
    const options = {
      page: currentPage,
      limit: perPage,
      sort: { createdAt: 1 }, //from first to most recent
      collation: {
        locale: "en"
      }
    };
    const reviews = await Review.paginate({ product_id: productId }, options);
    if (!reviews) {
      const error = new Error("No reviews found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      reviews: reviews
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

exports.getProductReviews = async (req, res, next) => {
  const productId = req.params.productId;

  try {
    const reviews = await Review.find({ product_id: productId });
    if (!reviews) {
      const error = new Error("No reviews found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      reviews: reviews
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

exports.getSingleProductReview = async (req, res, next) => {
  const reviewId = req.params.reviewId;

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      const error = new Error("Review not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      review: review
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

exports.addReview = async (req, res, next) => {
  const productId = req.params.productId;
  const userId = req.decoded.userId;
  //check if user has purchased product
  const userHasConfirmedOrder = userHasPurchasedGood(userId, productId); //returns true or false

  const description = req.body.description;
  const rating = req.body.rating;

  try {
    const review = new Review({
      user_id: userId,
      description: description,
      product_id: product_id,
      rating: rating,
      user_has_confirmed_purchase: userHasConfirmedOrder
    });

    await review.save();
    res.status(201).json({ message: "review add successfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

const userHasPurchasedGood = async (userId, productId) => {
  try {
    const orders = await Order.find({ user_id: userId });
    if (!orders) {
      return false;
    } else {
      //iterations
      let products = orders.map(order => {
        return order.products;
      });

      //products is an array. each index contains productId and quantity.
      //check if any index contains the product id

      let confirmedPurchases = products.filter(product => {
        return product.product_id === productId;
      });

      if (confirmedPurchases) {
        return false;
      } else {
        return true;
      }
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};
