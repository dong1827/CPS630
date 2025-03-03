document.addEventListener("DOMContentLoaded", function () {
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    const dropArea = document.getElementById("drop-area");
    const products = document.querySelectorAll(".product");

    function addToCart(product) {
        const productId = product.getAttribute("data-id");
        const productName = product.querySelector("h2").textContent;
        const productPrice = product.getAttribute("data-price");
        const productImage = product.querySelector("img").src;

        const cartItem = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        };

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(cartItem);
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        alert(`${productName} has been added to the cart!`);
    }

    addToCartButtons.forEach(button => {
        button.addEventListener("click", function () {
            addToCart(this.closest(".product"));
        });
    });

    products.forEach(product => {
        product.setAttribute("draggable", "true");

        product.addEventListener("dragstart", function (event) {
            event.dataTransfer.setData("product-id", product.getAttribute("data-id"));
        });
    });

    dropArea.addEventListener("dragover", function (event) {
        event.preventDefault();
        dropArea.classList.add("hover"); 
    });

    dropArea.addEventListener("dragleave", function () {
        dropArea.classList.remove("hover");
    });

    dropArea.addEventListener("drop", function (event) {
        event.preventDefault();
        dropArea.classList.remove("hover");
        const productId = event.dataTransfer.getData("product-id");

        if (productId) {
            const product = document.querySelector(`.product[data-id="${productId}"]`);
            if (product) {
                addToCart(product);
            }
        }
    });
});

