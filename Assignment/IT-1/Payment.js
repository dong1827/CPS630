app.controller('PaymentController', function($scope, $location) {
    const cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    const deliveryInfo = JSON.parse(sessionStorage.getItem('deliveryInfo')) || {};
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo')) || {};

    if (cartItems.length === 0) {
        alert('Your cart is empty. Please add items to your cart before proceeding to payment.');
        $location.path('/shopping');
        return;
    }

    $scope.cartItems = cartItems;
    $scope.subtotal = calculateSubtotal(cartItems);
    const deliveryFee = 0; 
    $scope.totalPrice = $scope.subtotal + deliveryFee;

    // Set the userId if present
    $scope.userId = userInfo.userId || '';
    
    $scope.processPayment = function() {
        if (!validatePaymentForm()) {
            return;
        }

        const jsonData = {
            amount: $scope.subtotal,
            userId: $scope.userId,
            deliveryAddress: deliveryInfo.address || '',
            items: cartItems,
        };

        const submitBtn = document.querySelector('.submit-btn');
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
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                sessionStorage.setItem('orderDetails', JSON.stringify(data));
                sessionStorage.removeItem('cartItems');
                $location.path('/orderConfirmation');
            } else {
                alert('Payment failed: ' + data.message);
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Pay and Submit Order';
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during payment processing. Please try again.');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Pay and Submit Order';
            }
        });
    };

    // Credit card number formatting
    $scope.formatCardNumber = function(e) {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';
        for (let i = 0; i < value.length && i < 16; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        e.target.value = formattedValue;
    };

    // Expiry date formatting
    $scope.formatExpiryDate = function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 4) {
            value = value.substring(0, 4);
        }
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        e.target.value = value;
    };

    // CVV input restriction
    $scope.formatCVV = function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 4) {
            value = value.substring(0, 4);
        }
        e.target.value = value;
    };

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

        // Validate card number (length check for most cards)
        if (cardNumber.length < 13 || cardNumber.length > 19) {
            alert('Please enter a valid credit card number.');
            return false;
        }

        // Validate CVV (3 or 4 digits)
        if (cvv.length < 3 || cvv.length > 4) {
            alert('Please enter a valid CVV code.');
            return false;
        }

        // Validate expiry date format (MM/YY)
        const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!expiryRegex.test(expiryDate)) {
            alert('Please enter a valid expiry date.');
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
});
