// const express = require('express');
// const router = express.Router();
// const stripe = require('stripe')('sk_test_51PO53VDE5AfVVJuDopkoDKzJSrwJvg94imLng7P62wySUvS1ahezDo0y0bNxD3HZPva1B6iO3Xq8YUms8diV4GUU003SHguPCo');
// router.post('/charge', async (req, res) => {
//   try {
//     const { stripeToken } = req.body;

//     const paymentIntent = await stripe.paymentIntents.create({
//         amount: 2000, // Amount in cents, adjust as needed
//         currency: 'usd',
//         payment_method: stripeToken,
//         confirm: true,
//     });

//     res.send({
//         status: paymentIntent.status,
//     });
// } catch (error) {
//     console.error('Error processing payment:', error);
//     res.status(500).send({
//         error: 'Failed to process payment. Please try again later.',
//     })}});
// module.exports=router;
