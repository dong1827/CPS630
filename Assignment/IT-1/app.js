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
        .when("/cart", {
            templateUrl: "cart.html"
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
    $scope.isSignUpOrIn = function() {
        var path = $location.path();
        return path === '/signin' || path === '/signup';
    };
});