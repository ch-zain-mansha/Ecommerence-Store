document.addEventListener('DOMContentLoaded', function() {
    // Function to aggregate product details
    function aggregateProductDetails(cart) {
        let productNames = [];
        let productSizes = [];
        let productQuantities = [];
        let productPrices = [];
        let totalPrice = 0;

        cart.forEach(item => {
            productNames.push(item.title || 'N/A'); // Default to 'N/A' if title is missing
            productSizes.push(item.size || 'N/A');  // Default to 'N/A' if size is missing
            productQuantities.push(item.quantity || '0'); // Default to '0' if quantity is missing
            productPrices.push(item.price || '0'); // Default to '0' if price is missing

            totalPrice += (item.quantity || 0) * parseFloat((item.price || '0').replace('PKR ', ''));
        });

        return {
            productNames: productNames.join(', '),
            productSizes: productSizes.join(', '),
            productQuantities: productQuantities.join(', '),
            productPrices: productPrices.join(', '),
            totalPrice: totalPrice
        };
    }

    // Populate form with aggregated cart data
    function populateFormWithCartData(cart) {
        const aggregatedData = aggregateProductDetails(cart);

        document.getElementById('product-names').value = aggregatedData.productNames;
        document.getElementById('product-sizes').value = aggregatedData.productSizes;
        document.getElementById('product-quantities').value = aggregatedData.productQuantities;
        document.getElementById('product-prices').value = aggregatedData.productPrices;
        document.getElementById('total-price').innerText = aggregatedData.totalPrice;
    }

    // Fetch cart data from localStorage and populate form
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    console.log('Cart Items:', cartItems); // Debugging line to check cart items

    if (cartItems.length > 0) {
        populateFormWithCartData(cartItems);
    } else {
        console.warn('No cart items found'); // Debugging line to handle empty cart
    }

    // Form submission handling
    document.getElementById('codForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const form = this;
        const formData = new FormData(form);

        fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                alert('Order placed successfully!');
                form.reset();
                localStorage.removeItem('cartItems'); // Clear cart after order is placed
            } else {
                response.json().then(data => {
                    if (data.errors) {
                        alert(data.errors.map(error => error.message).join(", "));
                    } else {
                        alert('There was an error placing your order. Please try again.');
                    }
                });
            }
        }).catch(error => {
            console.error('Error:', error);
            alert('There was an error placing your order. Please try again.');
        });
    });
});
