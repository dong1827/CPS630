document.addEventListener('DOMContentLoaded', function() {
    try {
        const orderDetails = JSON.parse(sessionStorage.getItem('orderDetails'));
        
        if (orderDetails) {
            displayOrderDetails(orderDetails);
        } else {
            showError('No order details found. Redirecting to home page...');
            setTimeout(() => {
                window.location.href = 'Home.html';
            }, 3000);
        }
    } catch (error) {
        console.error('Error parsing order details:', error);
        showError('Error retrieving order details. Redirecting to home page...');
        setTimeout(() => {
            window.location.href = 'Home.html';
        }, 3000);
    }
});

function displayOrderDetails(orderDetails) {
    setElementText('order-id', orderDetails.orderId);
    setElementText('order-date', formatDate(orderDetails.dateIssued));
    setElementText('delivery-date', formatDate(orderDetails.dateReceived));
    setElementText('payment-code', orderDetails.paymentCode);
    
    if (orderDetails.totalPrice) {
        setElementText('total-price', `$${parseFloat(orderDetails.totalPrice).toFixed(2)}`);
    }
}

function setElementText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text || 'Not available';
    }
}

function showError(message) {
    const contentElement = document.querySelector('.content');
    if (contentElement) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = 'red';
        errorElement.style.textAlign = 'center';
        errorElement.style.padding = '20px';
        errorElement.textContent = message;
        
        contentElement.insertBefore(errorElement, contentElement.firstChild);
        
        const orderDetails = document.querySelector('.order-details');
        if (orderDetails) {
            orderDetails.style.display = 'none';
        }
    }
}

function formatDate(dateString) {
    if (!dateString) return 'Not available';
    
    try {
        const date = new Date(dateString);
        
        if (isNaN(date.getTime())) {
            return dateString; 
        }
        
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        };
        
        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}