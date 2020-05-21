let FormData = require("form-data");

const Picture = require("../models/picture");
const Product = require("../models/product");
let jwt = require("jsonwebtoken");
let configEnv = require("../../config/config-env");
let middleware = require("../helpers/middleware");
const roleHelper = require("../helpers/roles");

exports.getAllPictures = async (req, res, next) => {
  try {
    const pictures = await Picture.find()
      .populate("product_id")
      .sort({ createdAt: -1 });
    if (!pictures) {
      const error = new Error("Pictures not found");
      error.statusCode = 404;
      next(error);
    }
    res.status(200).json({
      pictures: pictures
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getSinglePicture = async (req, res, next) => {
  const pictureId = req.params.pictureId;
  try {
    const picture = await Picture.findById(pictureId);
    if (!picture) {
      const error = new Error("picture not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      picture
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.getPicturesByProductId = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const pictures = await Picture.find({ product_id: productId });
    if (!pictures) {
      const error = new Error("no pictures not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      pictures
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.upload = async (req, res, next) => {
  console.log(req.body);

  const url = req.body.url;
  const largeImageUrl = req.body.largeImageUrl;
  const productId = req.body.productId;

  try {
    // const product = await Product.findById(productId);
    // if (!product) {
    //   const error = new Error("Invalid product id");
    //   error.statusCode = 404;
    //   return next(error);
    // }

    //save file urls to db
    const picture = new Picture({
      url: url,
      large_image_url: largeImageUrl,
      product_id: productId
    });

    let saved = await picture.save();
    const savedPicturePopulated = await Picture.findById(saved._id).populate(
      "product_id"
    );

    res.status(200).json({
      picture: savedPicturePopulated,
      message: "Picture uploaded successfuly"
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.deletePicture = async (req, res, next) => {
  const pictureId = req.params.pictureId;
  try {
    const picture = await Picture.findById(pictureId);
    if (!picture) {
      const error = new Error("picture not found");
      error.statusCode = 404;
      return next(error);
    }

    //picture can only be deleted by creator or super admin
    // const userRole = roleHelper.getUserRoles(req.decoded.userId);
    // if (userRole !== "super-admin") {
    //   const error = new Error("You are not authorized to delete this picture");
    //   error.statusCode = 403;
    //   return next(error);
    // }

    //delete
    await Picture.findByIdAndDelete(pictureId);
    res.status(200).json({ message: "picture successfully deleted", picture });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const uploadToCloudinary = async (file, next) => {
  const data = new FormData();
  data.append("file", file[0]);
  data.append("upload_preset", configEnv.variables.upload_preset);

  try {
    const res = await fetch(configEnv.variables.cloudinaryUrl, {
      method: "POST",
      body: data
    });
    console.log(res);

    const uploadedFile = await res.json();
    console.log(uploadedFile);

    const fileUrls = {
      image: uploadedFile.secure_url,
      largeImage: uploadedFile.eager[0].secure_url
    };
    return fileUrls;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};
