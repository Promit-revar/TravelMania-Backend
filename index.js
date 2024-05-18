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
    const endpointSecret = "whsec_XUi9G24C6Sd7u91NnE7O8bEESFP5iNR1";
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).json({success: false, error: `Webhook Error: ${err.message}`});
      return;
    }
    try{
    // Handle the event
    console.log(event.type);
    switch (event.type) {
      case 'charge.succeeded':
      const chargeSucceeded = event.data.object;
      await sendEmail();
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
 
    // switch (event.type) {
    //   case 'payment_intent.requires_action':
    //     const paymentIntentRequiresAction = event.data.object;
    //     console.log(paymentIntentRequiresAction);
    //     // Then define and call a function to handle the event payment_intent.requires_action
    //     break;
    //   case 'payment_intent.succeeded':
    //     const paymentIntentSucceeded = event.data.object;
    //     console.log(paymentIntentSucceeded);
    //     await sendEmail();
    //     // Then define and call a function to handle the event payment_intent.succeeded
    //     break;
    //   // ... handle other event types
    //   default:
    //     console.log(`Unhandled event type ${event.type}`);
    // }
  }
  catch(err){
    response.status(500).json({success: false, error: err.message});
  }
  });
app.use(express.json());
app.use('/api',router);

const port = process.env.PORT || 8000;
app.listen(port,()=>console.log(`server running on port: ${port}`));