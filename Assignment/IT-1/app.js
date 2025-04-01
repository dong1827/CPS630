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
            templateUrl: "Reviews.html",
            controller: 'reviewController'
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
app.controller('MainController', function($scope, $location, $http) {
    $scope.$watch(function() {
        return localStorage.getItem("userLoggedIn");
    }, function(newVal) {
        $scope.isUserLoggedIn = newVal === "true";
    });

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

    var url = '../IT-2/checkAdmin.php'
    var data = {username: localStorage.getItem("loginId")};
    $http.post(url, JSON.stringify(data), {
        headers: { "Content-Type": "application/json" }
        })
        .then(function (response) {
            if (response.data == 'Admin') {
                $scope.isAdmin = true;
            }
            else {
                $scope.isAdmin = false;
            }
            console.log($scope.isAdmin);
        });

    $scope.dropdownVisible = false;
    $scope.toggleDropdown = function () {
        $scope.dropdownVisible = !$scope.dropdownVisible;
    }
});

app.controller('reviewController', function ($scope, $http, $location) {
    $scope.rating = null;
    
    var url = '../IT-2/review.php';
    $http.get(url)
        .then(function (response) {
            console.log("Full response:", response);
            console.log("Response data:", response.data);
            $scope.items = response.data;
        });
    $scope.sortField = 'name';
    $scope.reverse = false;
    $scope.showItems = true;
    $scope.showTable = false; 

    $scope.fetchReview = function (id) {
        var reviewUrl = '../IT-2/review.php';
        var data = {id: id};
        $http.post(reviewUrl, JSON.stringify(data), {
            headers: { "Content-Type": "application/json" }
        })
            .then(function (response) {
                $scope.reviews = response.data;
                console.log(response.data);
        });

        $scope.sortField = 'username';
        $scope.reverse = false;
        $scope.showItems = false;
        $scope.showTable = true;
    };

    $scope.username = localStorage.getItem("loginId");
    $scope.showForm = false;
    
    $scope.toggleForm = function() {
        $scope.showForm = !$scope.showForm;
    };

    $scope.submitReview = function() {
        const formData = new FormData();
        formData.append('username', $scope.username);
        formData.append('itemID', $scope.itemID);
        formData.append('reviewText', $scope.reviewText);
        formData.append('rating', $scope.rating);

        $http.post('../IT-2/review.php', formData, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        })
        .then(function(response) {
            $scope.itemID = '';
            $scope.reviewText = '';
            $scope.rating = '';
            $scope.showForm = false;

            if (response.data.error) {
                alert("Error: " + response.data.error + "\nPlease ensure all fields are filled and you haven't reviewed this product before.");
            } else {
                alert("Thank you for reviewing our products!");
            }
        })
        .catch(function(error) {
            console.error("Submission error:", error);
            alert("An error occurred while submitting your review.");
        });
    };
});