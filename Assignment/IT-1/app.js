var app = angular.module("OSPApp", ["ngRoute"]);

app.config(function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    
    $routeProvider
        .when("/", {
            templateUrl: "home.html"
        })
        .when("/about", {
            templateUrl: "AboutUs.html"
        })
        .when("/signup", {
            templateUrl: "signup.html"
        })
        .when("/signin", {
            templateUrl: "signin.html"
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