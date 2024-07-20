document.addEventListener('DOMContentLoaded', function() {
    // Function to aggregate product details
    function aggregateProductDetails(cart) {
        let productNames = [];
        let productSizes = [];
        let productQuantities = [];
        let productPrices = [];
        let totalPrice = 0;

        cart.forEach(item => {
            productNames.push(item.title || 'N/A');
            productSizes.push(item.size || 'N/A');
            productQuantities.push(item.quantity || '0');
            productPrices.push(item.price || '0');
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
    console.log('Cart Items:', cartItems);

    if (cartItems.length > 0) {
        populateFormWithCartData(cartItems);
    } else {
        console.warn('No cart items found');
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
                localStorage.removeItem('cartItems');
                window.location.href = 'success.html'; // Redirect to home page

                var elements = document.getElementsByClassName('back-to-home');
                for (var i = 0; i < elements.length; i++) {
                    elements[i].setAttribute("href", "./success.html");
                }
            } else {
                response.json().then(data => {
                    if (data.errors) {
                        alert(data.errors.map(error => error.message).join(", "));
                    } else {
                        alert('There was an error placing your order. Please try again.');
                        window.location.href = 'cancel.html'; // Redirect to home page

                var elements = document.getElementsByClassName('back-to-home');
                for (var i = 0; i < elements.length; i++) {
                    elements[i].setAttribute("href", "./cancel.html");
                }
                    }
                });
            }
        }).catch(error => {
            console.error('Error:', error);
            alert('There was an error placing your order. Please try again.');
        });
    });
});
