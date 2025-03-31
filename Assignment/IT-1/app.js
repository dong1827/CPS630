var app = angular.module("OSPApp", ["ngRoute"]);

app.config(function($routeProvider) {   
    $routeProvider
        .when("/", {
            templateUrl: "Home.html"
        })
        .when("/about", {
            templateUrl: "AboutUs.html"
        })
        .when("/signup", {
            templateUrl: "SignUp.html",
            controller: "SignUpController"
        })
        .when("/signin", {
            templateUrl: "SignIn.html",
            controller: "SignInController"
        })
        .when("/reviews", {
            templateUrl: "Reviews.html"
        })
        .when("/services", {
            templateUrl: "Service.html"
        })
        .when("/shopping", {
            templateUrl: "Shopping.html",
            controller: "ShoppingController"
        })
        .when("/delivery", {
            templateUrl: "Delivery.html"
        })
        .when("/payment", {
            templateUrl: "Payment.html",
            controller: "PaymentController"
        })
        .when("/express", {
            templateUrl: "Express.html",
        })
        .when("/cart", {
            templateUrl: "cart.html",
            controller: "CartController"
        })
        .when("/search", {
            templateUrl: "../IT-2/search.html"
        })
        .when("/insert", {
            templateUrl: "../IT-2/insert.html"
        })
        .when("/update", {
            templateUrl: "../IT-2/update.html"
        })
        .when("/delete", {
            templateUrl: "../IT-2/delete.html"
        })
        .when("/select", {
            templateUrl: "../IT-2/select.html"
        })
        .otherwise({
            redirectTo: "/"
        });

});
app.controller('MainController', function($scope, $location) {
    $scope.isUserLoggedIn = localStorage.getItem("userLoggedIn") === "true";

    $scope.isSignUpOrIn = function() {
        var path = $location.path();
        return path === '/signin' || path === '/signup';
    };

    $scope.logout = function() {
        localStorage.removeItem("userLoggedIn");
        localStorage.removeItem("loginId");
        sessionStorage.removeItem("cartItems");
        sessionStorage.removeItem("deliveryInfo");
        sessionStorage.removeItem("orderDetails"); 
        $scope.isUserLoggedIn = false;
        $location.path('/signin');
    };
});