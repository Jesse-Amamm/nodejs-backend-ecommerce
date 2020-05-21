const Cart = require("../models/cart.js");
let jwt = require("jsonwebtoken");
let config = require("../../config/database.js");
let middleware = require("../helpers/middleware");
var pass = config.email_pass;
var email = config.email;

// Add to Cart...
exports.add = (req, res) => {
  //console.log(req)
  if (!req.body.products ) {
    return res.status(400).send({
      message: "At least one product is required in the cart, with it's id and quantity"
    });
  }
  Cart.findOne({ user_id: req.decoded.userId,  }, function(err, docs) {
    //    console.log(docs)
    if (docs) {  
      for(let i = 0;i<req.body.products;i++){
              let isExists = docs.products.findIndex(
        item => item.product_id === req.body.products[i],
      );
      if(isExists){
        doc.products[isExists].quantity = req.body.products[i].quantity;
        req.body.products.splice(i, 1)
      }
      }

      let new_products = docs.products.concat(req.body.products);
      Cart.findOneAndUpdate({user_id: req.decoded.userId, }, 
        {products:  new_products}, function(err, docs){
        if(err){
               console.log(err) 
                     res.status(500).send({
          message: err.message || "Some error occurred while updating the cart"
        });
        }
        res.status(200).send({
          message: "Cart updated successfully"
        });
      });
    } else {
           const Cart = new Cart({
        products: req.body.products,
        user_id: req.decoded.userId,
      });
      // Save Cart in the database
      Cart
        .save()
        .then(data => {
       //   let token = jwt.sign({ email: req.body.email }, config.secret);
          res.send({
            data: data,
          });
        })
        .catch(err => {
          res.status(500).send({
            message: err.message || "Some error occurred while adding to the Cart."
          });
        });
    }
  });

};

// // Removerom Cart...
// exports.remove = (req, res) => {
//   Cart.findByIdAndRemove(req.params.cart_id)
//     .then(cart => {
//       if (!cart) {
//         return res.status(404).send({
//           message: "Cart not found with id " + req.params.cart_id
//         });
//       }
//       res.send({ message: "Product removed from cart successfully" });
//     })
//     .catch(err => {
//       if (err.kind === "ObjectId" || err.name === "NotFound") {
//         return res.status(404).send({
//           message: "Cart not found with id " + req.params.cart_id
//         });
//       }
//       return res.status(500).send({
//         message: "Could not delete Cart with id " + req.params.cart_id
//       });
//     });
//   };

  exports.getCart = (req, res) => {
    Cart.find({ userId: req.decoded.userId })
      .sort("-updatedAt")
      .then(cart => {
        res.send(cart);
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving the user's cart"
        });
      });
  };




