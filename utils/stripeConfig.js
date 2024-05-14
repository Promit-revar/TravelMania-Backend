const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const createStripeSession = async(items) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [{
            price_data: {
                currency: items.currency.toLowerCase(),
                product_data:{
                    name: "Hotel Booking",
                },
                unit_amount: items.price * 100,
            },
            quantity: 1,
            
        }],
        success_url:"https://phuket-concierge.com/",
        cancel_url:"https://phuket-concierge.com/order-summary",
    });
    return session;
}
module.exports = createStripeSession;