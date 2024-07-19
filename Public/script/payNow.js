function submitPayment() {
    const paymentMethods = document.getElementsByName('payment-method');
    let selectedMethod = null;

    for (const method of paymentMethods) {
        if (method.checked) {
            selectedMethod = method.value;
            break;
        }
    }

    if (selectedMethod) {
        const submit = document.getElementById("submit");
        switch (selectedMethod) {
            case "easypaisa":
                submit.setAttribute("href", "../PayingMethods/easypaisa.html");
                break;
            case "jazzcash":
                submit.setAttribute("href", "../PayingMethods/jazzcash.html");
                break;
            case "upaisa":
                submit.setAttribute("href", "../PayingMethods/upaisa.html");
                break;
            case "cod":
                submit.setAttribute("href", "../PayingMethods/cod.html");
                break;
            default:
                alert('Invalid payment method selected.');
                return;
        }
    } else {
        alert('Please select a payment method.');
    }
}