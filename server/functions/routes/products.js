const router = require("express").Router();
const admin = require("firebase-admin");

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

const stripe = require('stripe')(process.env.STRIPE_KEY);

router.post("/create", async (req, res) => {
    try {
        const id = Date.now();
        const data = {
            product_id: id,
            product_name: req.body.product_name,
            product_category: req.body.product_category,
            product_price: req.body.product_price,
            imageURL: req.body.imageURL
        };

        const response = await db.collection("products").doc(`/${id}/`).set(data);
        return res.status(200).send({success: true, data: response});
    } catch (error) {
        return res.send({success: false, msg: `Error: ${error}`});
    }
});

// Get all the products

router.get('/all', async (req, res) => {
    (async () => {
        try {
            let query = db.collection("products");
            let response = [];
            await query.get().then((querysnap) => {
                let docs = querysnap.docs;
                docs.map(doc => {
                    response.push({...doc.data()});
                });
                return response;
            });
            return res.status(200).send({success: true, data: response});
            
        } catch (error) {
            return res.send({success: false, msg: `Error: ${error}`});
        }
    })()
});

// Delete all Products
router.delete("/delete/:productId", async (req, res) => {
    const productId = req.params.productId;
    try {
      await db
        .collection("products")
        .doc(`/${productId}/`)
        .delete()
        .then((result) => {
          return res.status(200).send({ success: true, data: result });
        });
    } catch (err) {
      return res.send({ success: false, msg: `Error :${err}` });
    }
  });

// Create a Cart
router.post("/addToCart/:userId", async (req, res) => {
    const userId = req.params.userId;
    const productId  = req.body.product_id;
    console.log(productId);

    try {
        const doc = await db
            .collection('cartItems')
            .doc(`/${userId}/`)
            .collection('items')
            .doc(`/${productId}/`)
            .get();

            if (doc.data()) {
                const quantity = doc.data().quantity + 1;
                const updatedItems = await db
                    .collection('cartItems')
                    .doc(`/${userId}/`)
                    .collection('items')
                    .doc(`/${productId}/`)
                    .update({quantity})
                return res.status(200).send({ success: true, data: result });
            } else {
                const data = {
                  productId: productId,
                  product_name: req.body.product_name,
                  product_category: req.body.product_category,
                  product_price: req.body.product_price,
                  imageURL: req.body.imageURL,
                  quantity: 1,
                };
                const addItems = await db
                  .collection("cartItems")
                  .doc(`/${userId}/`)
                  .collection("items")
                  .doc(`/${productId}/`)
                  .set(data);
                return res.status(200).send({ success: true, data: addItems });
            }
    } catch (error) {
      return res.send({ success: false, msg: `Error :${err}` });
    }
});

// Get All Cart Items for that User
router.get("/getCartItems/:user_id", async (req, res) => {
    const userId = req.params.user_id;
    (async () => {
      try {
        let query = db
          .collection("cartItems")
          .doc(`/${userId}/`)
          .collection("items");
        let response = [];
  
        await query.get().then((querysnap) => {
          let docs = querysnap.docs;
  
          docs.map((doc) => {
            response.push({ ...doc.data() });
          });
          return response;
        });
        return res.status(200).send({ success: true, data: response });
      } catch (er) {
        return res.send({ success: false, msg: `Error :,${er}` });
      }
    })();
  });

// Update Cart to Increase and Decrease the Quantity
router.post("/updateCart/:user_id", async (req, res) => {
  const userId = req.params.user_id;
  const productId  = req.query.productId;
  const type = req.query.type;

  try {
    const doc = await db
      .collection("cartItems")
      .doc(`/${userId}/`)
      .collection("items")
      .doc(`/${productId}/`)
      .get();

    if (doc.data()) {
      if (type === "increment") {
        const quantity = doc.data().quantity + 1;
        const updatedItem = await db
          .collection("cartItems")
          .doc(`/${userId}/`)
          .collection("items")
          .doc(`/${productId}/`)
          .update({ quantity });
        return res.status(200).send({ success: true, data: updatedItem });
      } else {
        if (doc.data().quantity === 1) {
          await db
            .collection("cartItems")
            .doc(`/${userId}/`)
            .collection("items")
            .doc(`/${productId}/`)
            .delete()
            .then((result) => {
              return res.status(200).send({ success: true, data: result });
            });
        } else {
          const quantity = doc.data().quantity - 1;
          const updatedItem = await db
            .collection("cartItems")
            .doc(`/${userId}/`)
            .collection("items")
            .doc(`/${productId}/`)
            .update({ quantity });
          return res.status(200).send({ success: true, data: updatedItem });
        }
      }
    }
  } catch (err) {
    return res.send({ success: false, msg: `Error :${err}` });
  }
});

// Stripe Payment Gateway
router.post("/create-checkout-session", async (req, res) => {
  const line_items = req.body.data.cart.map((item) => {
    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: item.product_name,
          images: [item.imageURL],
          metadata: {
            id: item.productId,
          },
        },
        unit_amount: item.product_price * 100,
      },
      quantity: item.quantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection: { allowed_countries: ["IN"] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 0, currency: "inr" },
          display_name: "Free shipping",
          delivery_estimate: {
            minimum: { unit: "hour", value: 2 },
            maximum: { unit: "hour", value: 4 },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    line_items: line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}`,
  });

  res.send({ url: session.url });
});

module.exports = router;