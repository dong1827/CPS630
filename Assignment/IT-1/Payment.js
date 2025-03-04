document.addEventListener('DOMContentLoaded', function() {
    const cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    const deliveryInfo = JSON.parse(sessionStorage.getItem('deliveryInfo')) || {};
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo')) || {};
    
    if (cartItems.length === 0) {
        alert('Your cart is empty. Please add items to your cart before proceeding to payment.');
        window.location.href = 'Shopping.html';
        return;
    }
    
    displayCartItems(cartItems);
    
    const subtotal = calculateSubtotal(cartItems);
    
    // For delivery fee, we'll show "Calculated at checkout" for now. will fix later
    const deliveryFee = 0; 
    const total = subtotal;
    
    document.getElementById('subtotal').textContent = `${subtotal.toFixed(2)}`;
    document.getElementById('delivery-fee').textContent = `Calculated at checkout`;
    document.getElementById('total-price').textContent = `${subtotal.toFixed(2)}+ Delivery`;
    
    const userIdElement = document.getElementById('user-id');
    if (userIdElement) {
        userIdElement.value = userInfo.userId || '';
    }
    
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validatePaymentForm()) {
                return;
            }
            
            processPayment();
        });
    }
    
    // Credit card number formatting
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            
            for (let i = 0; i < value.length && i < 16; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            
            e.target.value = formattedValue;
        });
    }
    
    // Expiry date formatting
    const expiryDateInput = document.getElementById('expiry-date');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 4) {
                value = value.substring(0, 4);
            }
            
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2);
            }
            
            e.target.value = value;
        });
    }
    
    // CVV input restriction
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 4) {
                value = value.substring(0, 4);
            }
            e.target.value = value;
        });
    }
});

function displayCartItems(items) {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    
    if (items.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }
    
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        cartItemsContainer.appendChild(itemElement);
    });
}

function calculateSubtotal(items) {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function validatePaymentForm() {

    const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
    const cvv = document.getElementById('cvv').value;
    const expiryDate = document.getElementById('expiry-date').value;
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const billingAddress = document.getElementById('billing-address').value;
    
    // Validate card number (simple check for length, should be 16 digits for most cards)
    if (cardNumber.length < 13 || cardNumber.length > 19) {
        alert('Please enter a valid credit card number.');
        return false;
    }
    
    // Validate CVV (3 or 4 digits)
    if (cvv.length < 3 || cvv.length > 4) {
        alert('Please enter a valid CVV code (3 or 4 digits).');
        return false;
    }
    
    // Validate expiry date format (MM/YY)
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryRegex.test(expiryDate)) {
        alert('Please enter a valid expiry date in the format MM/YY.');
        return false;
    }
    
    // Check if card is expired
    const [month, year] = expiryDate.split('/');
    const expiryMonth = parseInt(month, 10);
    const expiryYear = parseInt('20' + year, 10);
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; 
    const currentYear = currentDate.getFullYear();
    
    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
        alert('Your card has expired. Please use a different card.');
        return false;
    }
    
    // Validate name fields
    if (firstName.trim() === '' || lastName.trim() === '') {
        alert('Please enter your first and last name.');
        return false;
    }
    
    // Validate billing address
    if (billingAddress.trim() === '') {
        alert('Please enter your billing address.');
        return false;
    }
    
    return true;
}

function processPayment() {
    const deliveryInfo = JSON.parse(sessionStorage.getItem('deliveryInfo')) || {};
    const cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo')) || {};
    
    const subtotal = calculateSubtotal(cartItems);
    const deliveryFee = deliveryInfo.price || 0;
    const total = subtotal + deliveryFee;
    
    const form = document.getElementById('payment-form');
    const formData = new FormData(form);
    
    const jsonData = {};
    formData.forEach((value, key) => {
        jsonData[key] = value;
    });

    jsonData.amount = subtotal;
    jsonData.userId = userInfo.userId || 1;
    jsonData.deliveryAddress = deliveryInfo.address || '';
    jsonData.items = cartItems;
    
    const submitBtn = form.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';
    }
    

    fetch('../IT-2/processPayment.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {

            sessionStorage.setItem('orderDetails', JSON.stringify({
                orderId: data.orderId,
                totalPrice: data.totalPrice,
                paymentCode: data.paymentCode,
                dateIssued: data.dateIssued,
                dateReceived: data.dateReceived
            }));
            
            sessionStorage.removeItem('cartItems');
            
            window.location.href = 'OrderConfirmation.html';
        } else {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Pay and Submit Order';
            }
            
            alert('Payment failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Pay and Submit Order';
        }
        
        alert('An error occurred during payment processing. Please try again.');
    });
}