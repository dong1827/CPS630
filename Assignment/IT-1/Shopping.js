document.addEventListener("DOMContentLoaded", function () {
    const dropArea = document.getElementById("drop-area");
    const productList = document.querySelector(".products"); 

    function fetchProducts() {
        fetch("../IT-2/shopping.php") 
            .then(response => response.json())
            .then(items => {
                console.log("Fetched Items:", items); 

                productList.innerHTML = ""; 

                items.forEach(item => {
                    const productDiv = document.createElement("div");
                    productDiv.classList.add("product");
                    productDiv.setAttribute("data-id", item.itemId);
                    productDiv.setAttribute("data-price", item.price);
                    productDiv.setAttribute("draggable", "true");

                    productDiv.innerHTML = `
                        <img src="${item.imagePath}" alt="${item.itemName}">
                        <h2>${item.itemName}</h2>
                        <p class="price">$${item.price}</p>
                        <button class="add-to-cart">Add to Cart</button>
                    `;

                    productList.appendChild(productDiv);
                    const addToCartButton = productDiv.querySelector(".add-to-cart");
                    addToCartButton.addEventListener("click", function () {
                        addToCart(productDiv);
                    });

                    productDiv.addEventListener("dragstart", function (event) {
                        event.dataTransfer.setData("product-id", item.itemId);
                    });
                });
            })
            .catch(error => console.error("Error fetching products:", error));
    }

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

    fetchProducts(); 
});
