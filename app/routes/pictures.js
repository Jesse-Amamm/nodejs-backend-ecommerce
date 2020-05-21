const express = require("express");
const router = express.Router();
const pictureController = require("../controllers/pictures");
const middleware = require("../helpers/middleware");

//GET all pictures
router.get("/all-pictures", pictureController.getAllPictures);

//GET one picture
router.get("/picture/:pictureId", pictureController.getSinglePicture);

//GET all pictures for a product
router.get("/:productId", pictureController.getPicturesByProductId);

//POST upload picture
//can only be created by super admin
router.post(
  "/picture",
  //   middleware.checkRole,

  pictureController.upload
);

//delete pictures
router.post(
  "/delete-picture/:pictureId",
  // middleware.checkRole,
  pictureController.deletePicture
);

module.exports = router;
