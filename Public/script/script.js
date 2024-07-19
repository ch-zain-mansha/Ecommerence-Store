if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

function ready() {
    const cartBasket = document.getElementById("cart-icon");
    const cart = document.querySelector(".cart");
    const closeCart = document.querySelector(".x");

    cartBasket.addEventListener("click", () => {
        cart.classList.add("cart-active");
    });

    closeCart.addEventListener("click", () => {
        cart.classList.remove("cart-active");
    });

    const addCartButtons = document.getElementsByClassName("bag");
    for (var i = 0; i < addCartButtons.length; i++) {
        const button = addCartButtons[i];
        button.addEventListener("click", addCartClicked);
    }

    const payNowButton = document.querySelector(".pay-now");
    payNowButton.addEventListener("click", checkout);

    loadCartItems();
    updateCartIcon();
}

function addCartClicked(event) {
    const button = event.target;
    const shopProduct = button.closest(".product-box");
    const productTitle = shopProduct.getElementsByClassName("product-title")[0].innerText;
    const productPrice = shopProduct.getElementsByClassName("product-price")[0].innerText;
    const productImg = shopProduct.getElementsByClassName("product-img")[0].src;
    const productSize = shopProduct.querySelector("select").value; // Get the selected size
    addProductToCart(productTitle, productPrice, productImg, productSize);
    updateTotal();
    saveCartItems();
    updateCartIcon();
}

function addProductToCart(productTitle, productPrice, productImg, productSize) {
    var cartItems = document.getElementsByClassName("product-cart-content")[0];
    var cartItemsNames = cartItems.getElementsByClassName("product-title");

    for (var i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerText === productTitle) {
            alert("This product is already added to cart");
            return;
        }
    }

    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add("card_boxes");

    var cartBoxContent = `
        <div class="cart-img-container">
            <img src="${productImg}" alt="Product Image" class="cart-img">
        </div>
        <div class="cart-product-detail">
            <h5 class="product-title">${productTitle}</h5>
            <h5 class="price">${productPrice}</h5>
            <p class="product-size">Size: ${productSize}</p> <!-- Display selected size -->
            <input type="number" class="product-quantity" min="1" value="1"/>
        </div>
        <div class="delete-product-cart">
            <i class="ri-delete-bin-line cart-bin"></i>
        </div>
    `;
    cartShopBox.innerHTML = cartBoxContent;
    cartItems.appendChild(cartShopBox);

    cartShopBox.getElementsByClassName("cart-bin")[0].addEventListener("click", cartDelete);
    cartShopBox.getElementsByClassName("product-quantity")[0].addEventListener("change", quantityChanged);
    saveCartItems();
}

function cartDelete(event) {
    const buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateTotal();
    saveCartItems();
    updateCartIcon();
}

function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateTotal();
    saveCartItems();
    updateCartIcon();
}

function updateTotal() {
    var cartContent = document.getElementsByClassName("product-cart-content")[0];
    var cardBoxes = cartContent.getElementsByClassName("card_boxes");
    var total = 0;
    for (var i = 0; i < cardBoxes.length; i++) {
        var cardBox = cardBoxes[i];
        var priceElement = cardBox.getElementsByClassName("price")[0];
        var productQuantity = cardBox.getElementsByClassName("product-quantity")[0];
        if (priceElement && productQuantity) {
            var priceText = priceElement.innerText.replace('PKR ', '');
            var price = parseFloat(priceText);
            var quantity = productQuantity.value;
            if (!isNaN(price) && !isNaN(quantity)) {
                total += quantity * price;
            }
        }
    }
    document.querySelector(".total-price h4").innerText = "Total: PKR " + total;
    localStorage.setItem('cartTotal', total);
}

function saveCartItems() {
    var cartContent = document.getElementsByClassName('product-cart-content')[0];
    var cartBoxes = cartContent.getElementsByClassName('card_boxes');
    var cartItems = [];
    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var titleElement = cartBox.getElementsByClassName('product-title')[0];
        var priceElement = cartBox.getElementsByClassName('price')[0];
        var quantityElement = cartBox.getElementsByClassName('product-quantity')[0];
        var imgElement = cartBox.getElementsByClassName('cart-img')[0].src;
        var sizeElement = cartBox.getElementsByClassName('product-size')[0].innerText.replace('Size: ', '');

        var item = {
            title: titleElement.innerText,
            price: priceElement.innerText,
            quantity: quantityElement.value,
            image: imgElement,
            size: sizeElement, // Save the size
        };
        cartItems.push(item);
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function loadCartItems() {
    var cartItems = localStorage.getItem("cartItems");
    if (cartItems) {
        cartItems = JSON.parse(cartItems);
        for (var i = 0; i < cartItems.length; i++) {
            var item = cartItems[i];
            addProductToCart(item.title, item.price, item.image, item.size);
            var cartBoxes = document.getElementsByClassName('card_boxes');
            var cartBox = cartBoxes[cartBoxes.length - 1];
            var quantityElement = cartBox.getElementsByClassName('product-quantity')[0];
            quantityElement.value = item.quantity;
        }
    }
    updateTotal(); 
    updateCartIcon();
}

function updateCartIcon() {
    let cartBoxes = document.getElementsByClassName('card_boxes');
    let quantity = 0;
    for (let i = 0; i < cartBoxes.length; i++) {
        let cartBox = cartBoxes[i];
        let quantityElement = cartBox.getElementsByClassName('product-quantity')[0];
        quantity += parseInt(quantityElement.value);
    }
    let cartQuantity = document.querySelector('#cart-icon');
    cartQuantity.setAttribute('data-quantity', quantity);
}

function checkout() {
    var cartItems = JSON.parse(localStorage.getItem('cartItems'));

    if (cartItems.length === 0) {
        alert("Your cart is empty. Please add items before checking out.");
        return;
    }

    var confirmation = confirm("Proceed to checkout?");
    if (confirmation) {
        var elements = document.getElementsByClassName('pay-now-link');
        for (var i = 0; i < elements.length; i++) {
            elements[i].setAttribute("href", "./payNow.html");
        }

        const cart = document.querySelector('.cart');
        cart.classList.remove('cart-active');
        updateCartIcon(); 
    }
}
