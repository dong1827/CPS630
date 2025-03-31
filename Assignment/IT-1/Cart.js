app.controller("CartController", function ($scope, $location) {
    $scope.isLoggedIn = localStorage.getItem("userLoggedIn") === "true";

    if (!$scope.isLoggedIn) {
        $location.path("/signin"); 
        return;
    }

    $scope.cart = JSON.parse(localStorage.getItem("cart")) || [];
    $scope.total = 0;

    $scope.calculateTotal = function () {
        $scope.total = $scope.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    $scope.removeFromCart = function (index) {
        $scope.cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify($scope.cart));
        $scope.calculateTotal();
    };

    $scope.checkout = function () {
        sessionStorage.setItem("cartItems", JSON.stringify($scope.cart));
        $location.path("/payment");
    };

    $scope.calculateTotal();
});
