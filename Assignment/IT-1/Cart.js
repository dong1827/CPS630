document.addEventListener("DOMContentLoaded", function () {
    let isLoggedIn = localStorage.getItem("userLoggedIn");

    if (!isLoggedIn || isLoggedIn !== "true") {
        window.location.href = "SignIn.html"; 
        return; 
    }

    loadCart();
});

function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartContainer = document.getElementById("cart-items");
    let cartTotal = document.getElementById("cart-total");
    let checkoutButton = document.getElementById("checkout-btn");
    sessionStorage.setItem("cartItems", JSON.stringify(cart));

    cartContainer.innerHTML = ""; 
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        checkoutButton.style.display = "none"; 
        return;
    }

    checkoutButton.style.display = "block"; 

    cart.forEach((item, index) => {
        let itemElement = document.createElement("div");
        itemElement.classList.add("cart-item");
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>Price: $${item.price}</p>
                <p>Quantity: ${item.quantity}</p>
                <button id="remove" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
        cartContainer.appendChild(itemElement);
        total += item.price * item.quantity;
    });

    cartTotal.textContent = total.toFixed(2);
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1); 
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart(); 
}

document.getElementById("checkout-btn").addEventListener("click", function () {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    sessionStorage.setItem("cartItems", JSON.stringify(cart));
    window.location.href = "Payment.html";
});
