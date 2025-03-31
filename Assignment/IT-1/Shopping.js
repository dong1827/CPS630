app.controller("ShoppingController", function ($scope, $http) {
    $scope.products = []; 
    $scope.cart = JSON.parse(localStorage.getItem("cart")) || []; 

    $scope.fetchProducts = function () {
        $http.get("../IT-2/shopping.php").then(function (response) {
            console.log("Fetched Items:", response.data);
            $scope.products = response.data; 
            setTimeout($scope.initDragAndDrop, 500)
        }, function (error) {
            console.error("Error fetching products:", error);
        });
    };

    $scope.addToCart = function (product) {
        let existingItem = $scope.cart.find(item => item.id === product.itemId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            $scope.cart.push({
                id: product.itemId,
                name: product.itemName,
                price: product.price,
                image: product.imagePath,
                quantity: 1
            });
        }

        localStorage.setItem("cart", JSON.stringify($scope.cart));
        alert(`${product.itemName} has been added to the cart!`);
    };

    
    $scope.initDragAndDrop = function () {
        let products = document.querySelectorAll(".product");

        products.forEach((product) => {
            product.addEventListener("dragstart", function (event) {
                let productId = product.getAttribute("data-id");
                event.dataTransfer.setData("product-id", productId);
                console.log("Dragging product:", productId);
            });
        });

        let dropArea = document.getElementById("drop-area");

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

            let productId = event.dataTransfer.getData("product-id");
            console.log("Dropped product ID:", productId);

            let product = $scope.products.find(p => p.itemId == productId);

            if (product) {
                console.log("Product found:", product);
                $scope.$apply(() => {
                    $scope.addToCart(product);
                });
            } else {
                console.error("Product not found!");
            }
        });
    };

    $scope.fetchProducts();
});
