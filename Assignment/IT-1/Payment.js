app.controller('PaymentController', function($scope, $location) {
    const cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    const deliveryInfo = JSON.parse(sessionStorage.getItem('deliveryInfo')) || {};
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo')) || {};

    // Instead of redirecting immediately if cart is empty, check if we have delivery info
    if (cartItems.length === 0 && !deliveryInfo.tripId) {
        alert('Your cart is empty. Please add items to your cart before proceeding to payment.');
        $location.path('/shopping');
        return;
    }

    // If cart is empty but we have delivery info, create a dummy cart item
    if (cartItems.length === 0 && deliveryInfo.tripId) {
        const dummyCartItems = [{
            id: 'delivery-only',
            name: 'Delivery Service',
            price: parseFloat(deliveryInfo.cost) || 0,
            quantity: 1
        }];
        sessionStorage.setItem('cartItems', JSON.stringify(dummyCartItems));
        $scope.cartItems = dummyCartItems;
    } else {
        $scope.cartItems = cartItems;
    }


    const currentDate = new Date();
    const targetDate = new Date('2025-05-01');

    $scope.isExpressAvailable = currentDate <= targetDate;
    $scope.cartItems = cartItems;
    $scope.subtotal = calculateSubtotal(cartItems);
    $scope.deliveryFee = 0; 
    $scope.totalPrice = $scope.subtotal + $scope.deliveryFee;
    $scope.paymentMethod = 'card';
    
    $scope.deliveryDate = deliveryInfo.date;
    $scope.deliveryTime = deliveryInfo.time;
    $scope.standardDeliveryDate = deliveryInfo.date;
    
    $scope.userId = parseInt(localStorage.getItem("userId")) || null;
    
    if (!$scope.userId && userInfo && userInfo.userId) {
        $scope.userId = parseInt(userInfo.userId);
    }
    
    if (!$scope.userId) {
        $scope.userId = 3;
    }

    $scope.updateShipping = function() {
        const shippingOption = document.querySelector('input[name="shipping"]:checked').value;

        if (shippingOption === 'express' && $scope.isExpressAvailable) {
            $scope.shippingFee = 35;
            
            const tomorrow = new Date();
            tomorrow.setDate(currentDate.getDate() + 1);
            const yyyy = tomorrow.getFullYear();
            const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
            const dd = String(tomorrow.getDate()).padStart(2, '0');
            $scope.deliveryDate = `${yyyy}-${mm}-${dd}`;
            $scope.deliveryTime = "10:00";
        } else {
            $scope.shippingFee = 0;
            $scope.deliveryDate = $scope.standardDeliveryDate;
            $scope.deliveryTime = deliveryInfo.time;
        }
        
        $scope.deliveryFee = $scope.shippingFee;
        $scope.totalPrice = $scope.subtotal + $scope.shippingFee;
        
        const updatedDeliveryInfo = {...deliveryInfo, 
            date: $scope.deliveryDate, 
            time: $scope.deliveryTime,
            isExpress: shippingOption === 'express'
        };
        
        sessionStorage.setItem('deliveryInfo', JSON.stringify(updatedDeliveryInfo));
    };

    document.querySelectorAll('input[name="shipping"]').forEach(function(input) {
        input.addEventListener('change', $scope.updateShipping);
    });

    $scope.processPayment = function() {
        let isValid = false;
        
        switch($scope.paymentMethod) {
            case 'card':
                isValid = validateCardPaymentForm();
                break;
            case 'giftcard':
                isValid = validateGiftCardPaymentForm();
                break;
            case 'cash':
                isValid = validateCashPaymentForm();
                break;
            default:
                alert('Please select a payment method');
                return;
        }
        
        if (!isValid) {
            return;
        }

        const shippingOption = document.querySelector('input[name="shipping"]:checked').value;
        const isExpress = shippingOption === 'express' && $scope.isExpressAvailable;

        const jsonData = {
            amount: $scope.totalPrice,
            userId: $scope.userId,
            deliveryAddress: deliveryInfo.address || '',
            deliveryDate: $scope.deliveryDate,
            deliveryTime: $scope.deliveryTime,
            items: cartItems,
            paymentMethod: $scope.paymentMethod,
            isExpressDelivery: isExpress
        };
        
        if ($scope.paymentMethod === 'giftcard') {
            jsonData.giftCardNumber = $scope.giftCardNumber;
            jsonData.giftCardPin = $scope.giftCardPin;
        } else if ($scope.paymentMethod === 'cash') {
            jsonData.contactNumber = $scope.contactNumber;
            jsonData.cashOnDelivery = true;
        }

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
                    data.deliveryDate = $scope.deliveryDate;
                    data.deliveryTime = $scope.deliveryTime;
                    data.isExpressDelivery = isExpress;

                    // Clear cart data
                    sessionStorage.removeItem('cartItems');

                    // Store order details
                    sessionStorage.setItem('orderDetails', JSON.stringify(data));

                    // Navigate to confirmation page
                    $location.path('/orderConfirmation');
                    $scope.$apply();
                } else {
                    alert('Payment failed: ' + data.message);
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Pay and Submit Order';
                    }
                }
            })
        .catch(error => {
            alert('An error occurred during payment processing. Please try again.');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Pay and Submit Order';
            }
        });
    };

    $scope.formatCardNumber = function($event) {
        if (!$event || !$event.target) return;
        
        let value = $event.target.value.replace(/\D/g, '');
        let formattedValue = '';
        for (let i = 0; i < value.length && i < 16; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        $event.target.value = formattedValue;
    };

    $scope.formatExpiryDate = function($event) {
        if (!$event || !$event.target) return;
        
        let value = $event.target.value.replace(/\D/g, '');
        if (value.length > 4) {
            value = value.substring(0, 4);
        }
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        $event.target.value = value;
    };

    $scope.formatCVV = function($event) {
        if (!$event || !$event.target) return;
        
        let value = $event.target.value.replace(/\D/g, '');
        if (value.length > 4) {
            value = value.substring(0, 4);
        }
        $event.target.value = value;
    };

    function calculateSubtotal(items) {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    function validateCardPaymentForm() {
        const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
        const cvv = document.getElementById('cvv').value;
        const expiryDate = document.getElementById('expiry-date').value;
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const billingAddress = document.getElementById('billing-address').value;

        if (cardNumber.length < 13 || cardNumber.length > 19) {
            alert('Please enter a valid credit card number.');
            return false;
        }

        if (cvv.length < 3 || cvv.length > 4) {
            alert('Please enter a valid CVV code.');
            return false;
        }

        const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!expiryRegex.test(expiryDate)) {
            alert('Please enter a valid expiry date.');
            return false;
        }

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

        if (firstName.trim() === '' || lastName.trim() === '') {
            alert('Please enter your first and last name.');
            return false;
        }

        if (billingAddress.trim() === '') {
            alert('Please enter your billing address.');
            return false;
        }

        return true;
    }
    
    function validateGiftCardPaymentForm() {
        const giftCardNumber = document.getElementById('gift-card-number').value.trim();
        const giftCardPin = document.getElementById('gift-card-pin').value.trim();
        const firstName = document.getElementById('gift-first-name').value.trim();
        const lastName = document.getElementById('gift-last-name').value.trim();
        
        if (giftCardNumber.length < 8 || giftCardNumber.length > 20) {
            alert('Please enter a valid gift card number.');
            return false;
        }
        
        if (giftCardPin.length < 3 || giftCardPin.length > 6) {
            alert('Please enter a valid PIN.');
            return false;
        }
        
        if (firstName === '' || lastName === '') {
            alert('Please enter your first and last name.');
            return false;
        }
        
        return true;
    }
    
    function validateCashPaymentForm() {
        const firstName = document.getElementById('cash-first-name').value.trim();
        const lastName = document.getElementById('cash-last-name').value.trim();
        const contactNumber = document.getElementById('contact-number').value.trim();
        
        if (firstName === '' || lastName === '') {
            alert('Please enter your first and last name.');
            return false;
        }
        
        if (contactNumber.length < 10) {
            alert('Please enter a valid contact number.');
            return false;
        }
        
        return true;
    }
});
