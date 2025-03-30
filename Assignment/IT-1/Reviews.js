var myapp = angular.module('review',[]);
myapp.controller('reviewController', function ($scope, $http) {
    var url = '../IT-2/review.php';
    $http.get(url)
        .then(function (response) {
            $scope.items = response.data;
            console.log(response.data);
        });
    $scope.sortField = 'name';
    $scope.reverse = false;
    $scope.showItems = true;
    $scope.showTable = false; 

    $scope.fetchReview = function (id) {
        var reviewUrl = '../IT-2/review.php';
        var data = {id: id};
        $http.post(reviewUrl, data)
            .then(function (response) {
                $scope.item = response.data;
                console.log(response.data);
        });

        $scope.sortField = 'user';
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
        .then(response => response.text())
        .then(data => {
            reviewForm.reset();
            alert("Thank you for reviewing our products");
            console.log("Form submitted successfully:", data);
        })
        .catch(error => {
            console.error("Error submitting form:", error);
        });
    });
});

function toggleForm() {
    document.getElementById("reviewForm").classList.toggle("hidden");
}
