var myapp = angular.module('review',[]);
myapp.controller('reviewController', function ($scope, $http) {
    // Change this to php 
    var url = 'fetchReview.php';
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
        var reviewUrl = 'fetchReview.php';
        var data = {id: id};
        $http.post(reviewUrl, data)
            .then(function (response) {
                $scope.item = response.data
        });

        $scope.sortField = 'user';
        $scope.reverse = false;
        $scope.showItems = false;
        $scope.showTable = true;
    };
});

document.getElementById("username").value = localStorage.setItem("loginId", username);

function toggleForm(){
    document.getElementById("reviewForm").classList.toggle("show");
}
