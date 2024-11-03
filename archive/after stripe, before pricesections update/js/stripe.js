// Initialize Stripe with your publishable key
const stripe = Stripe('pk_test_51QH6WNKSYXd8SrWaiRyaQ9yMtSfdkQHT3smTI4ANpxQ94xOX6jKwcQ3u4KUmgg1ISLgBtKjjlLdZfv6fylq6huUB00WhCpLcYL');

async function handlePurchase() {
    try {
        // Show some loading state
        const button = document.querySelector('.buy-button');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        button.disabled = true;

        // Create a checkout session
        const response = await fetch('/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                quantity: 1 // You can make this dynamic if you add quantity selector
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const session = await response.json();

        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        });

        if (result.error) {
            throw new Error(result.error.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
        
        // Reset button state
        const button = document.querySelector('.buy-button');
        button.innerHTML = '<i class="fas fa-shopping-cart"></i> Purchase Now';
        button.disabled = false;
    }
}

// Add click handler to the purchase button
document.querySelector('.buy-button').addEventListener('click', handlePurchase);