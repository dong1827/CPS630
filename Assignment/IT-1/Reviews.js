var myapp = angular.module('review',[]);
myapp.controller('reviewController', function ($scope, $http) {
    var url = '../IT-2/review.php';
    $http.get(url)
        .then(function (response) {
            console.log("Full response:", response); // Log everything
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
});

document.addEventListener("DOMContentLoaded", function() {
    let user = localStorage.getItem("loginId");
    document.getElementById("username").value = user;
    let reviewForm = document.getElementById("reviewForm")

    reviewForm.addEventListener("submit", function(event) {
        event.preventDefault();

        let formData = new FormData(this);

        fetch("../IT-2/review.php", {
            method: "POST",
            body: formData, 
        })
        .then(response => response.json())
        .then(data => {
            reviewForm.reset();
            if (data.error) {
                alert("Error, please make sure you filled out all the fields, and you have never reviewed this product before");
            }
            else {
                alert("Thank you for reviewing our products");
            }
            
            console.log(data);
            console.log(data.error);
        })
        .catch(error => {
            console.error("Error submitting form:", error);
        });
    });
});

function toggleForm() {
    document.getElementById("reviewForm").classList.toggle("hidden");
}
