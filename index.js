const express = require('express');
require('dotenv').config();
const router = require("./routes/web");
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const cors = require('cors');
const sendEmail = require('./utils/sendMail');
const app = express();
app.use(cors());
app.post('/api/webhook',express.raw({ type: 'application/json' }),async(request, response) => {
    const sig = request.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, 'whsec_31a291a60be2ed797c8d6884a27848f0dc828be87ef1279482c4ee83a077c810');
    } catch (err) {
      console.log(err.message);
      response.status(400).json({success: false, error: `Webhook Error: ${err.message}`});
      return;
    }
    try{
    // Handle the event
    // const payload = JSON.parse(checkoutSessionCompleted.metadata.data);
    // console.log(payload);
    switch (event.type) {
      case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;
      const bookingResponse = await router.makeBooking();
      if(checkoutSessionCompleted.payment_status === 'paid'){
        await sendEmail({email: checkoutSessionCompleted.customer_details.email, name: checkoutSessionCompleted.customer_details.name, bookingData: {...bookingResponse, geoData: JSON.parse(checkoutSessionCompleted.metadata.data)}})
      }
      // await sendEmail(paymentIntentSucceeded.receipt_email);
      break;
      case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      break;
      case 'charge.succeeded':
      const chargeSucceeded = event.data.object;
      // Then define and call a function to handle the event charge.succeeded
      break;
    case 'charge.updated':
      const chargeUpdated = event.data.object;
      // Then define and call a function to handle the event charge.updated
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
    }
    response.status(200).json(event);
    
  }
  catch(err){
    response.status(500).json({success: false, error: err.message});
  }
  });
app.use(express.json());
app.use('/api',router.router);

const port = process.env.PORT || 8000;
app.listen(port,()=>console.log(`server running on port: ${port}`));