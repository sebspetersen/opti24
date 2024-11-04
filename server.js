// Load environment variables first
require('dotenv').config();

const express = require('express');
const Stripe = require('stripe');

// Check if we have the API key
if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Missing STRIPE_SECRET_KEY in environment variables');
    process.exit(1);
}

// Initialize Stripe with the API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(express.static('.'));
app.use(express.json());

// Create checkout session endpoint
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { quantity } = req.body;
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            allow_promotion_codes: true,
            line_items: [
                {
                    price_data: {
                        currency: 'dkk',
                        product_data: {
                            name: 'Lions Mane Kapsler',
                            description: 'Premium svampetilskud (60 kapsler)',
                            images: [`${process.env.DOMAIN}/assets/images/product/productimage.png`],
                            metadata: {
                                product_id: 'LM-001'
                            }
                        },
                        unit_amount: 9900, // 150 DKK in øre (smallest currency unit)
                    },
                    quantity: quantity || 1,
                },
            ],
            mode: 'payment',
            locale: 'da', // Set checkout language to Danish
            shipping_address_collection: {
                allowed_countries: ['DK'], // Only allow shipping to Denmark
            },
            billing_address_collection: 'required',
            success_url: `${process.env.DOMAIN}/success.html`,
            cancel_url: `${process.env.DOMAIN}/index.html`,
            custom_text: {
                shipping_address: {
                    message: 'Vi leverer kun i Danmark.'
                },
                submit: {
                    message: 'Vi behandler din betaling sikkert med Stripe.'
                }
            },
            payment_intent_data: {
                metadata: {
                    product: 'Lions Mane Kapsler',
                    quantity: quantity || 1
                }
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 3900, // 39 DKK in øre
                            currency: 'dkk',
                        },
                        display_name: 'PostNord Levering',
                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 2,
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 4,
                            },
                        },
                    },
                },
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 0000, // 49 DKK in øre
                            currency: 'dkk',
                        },
                        display_name: 'Fri Levering',
                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 1,
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 2,
                            },
                        },
                    },
                }
            ],
            phone_number_collection: {
                enabled: true // Collect phone number for shipping
            }
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Der opstod en fejl ved oprettelse af checkout session',
            details: error.message 
        });
    }
});

// Success page
app.get('/success.html', (req, res) => {
    res.sendFile('success.html', { root: '.' });
});

// Cancel page
app.get('/cancel.html', (req, res) => {
    res.sendFile('cancel.html', { root: '.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server kører på port ${PORT}`);
    console.log(`Stripe nøgle indlæst: ${process.env.STRIPE_SECRET_KEY ? 'Ja' : 'Nej'}`);
});
