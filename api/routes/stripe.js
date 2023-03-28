const router = require("express").Router();
const Product = require("../models/Product");


const KEY = process.env.STRIPE_KEY
const stripe = require('stripe')(KEY);



router.post('/payment', async (req, res) => {
  
   const items = req.body.data.cart.products;

   const line_items = items.map(item =>{
    return {
      price_data: {
              currency: 'inr',
             product_data: {
             name: item.title,
                metadata:{ id: item._id,},
             },
              unit_amount: item.price*100 ,
            },
            quantity: item.quantity,
      }
   })

  
 const session = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    success_url: 'http://localhost:3000/?success=true',
  cancel_url: 'http://localhost:3000',
});
  res.send({url: session.url});
});

module.exports = router;