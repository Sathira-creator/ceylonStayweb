import stripe from 'stripe';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Hotel from '../models/Hotel.js';





// API to handle Stripe webhooks

export const stripeWebhooks = async (request, response)=>{
    // Stripe gateway initialize 
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers['stripe-signature'];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (error) {
        return response.status(400).send(`Webhook Error: ${error.message}`);
    }

    // Handle the event
    if(event.type === 'payment_intent.succeeded'){
        try {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // getting session metadata
            const sessions = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            })

            if (!sessions.data[0]) {
                return response.status(400).json({ received: false, error: "Session not found" });
            }

            const {bookingId, hotelId, totalPrice } = sessions.data[0].metadata;
            
            
            // Mark payment as paid
            await Booking.findByIdAndUpdate(bookingId, {isPaid: true, paymentMethod: "Stripe"}, {new: true})
            
            await Hotel.findByIdAndUpdate(hotelId, { $inc: {wallet: Number(totalPrice)}  }, {new: true});
            
            

        } catch (error) {
            console.error("Error processing payment webhook:", error);
            return response.status(400).json({ received: false, error: error.message });
        }

    }else{
        console.log("Unhandled event type :", event.type );
    }
    response.json({received: true});
}