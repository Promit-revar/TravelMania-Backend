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
                unit_amount: Math.round(Number(items.price) * 100),
            },
            quantity: 1,
            
        }],
        success_url:"https://phuket-concierge.com?success=true",
        cancel_url:"https://phuket-concierge.com/order-summary",
        // metadata: {
        //     data: JSON.stringify(items.data),
        // }
    });
    return session;
}
module.exports = createStripeSession;