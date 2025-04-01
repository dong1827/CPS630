angular.module('OSPApp').controller('SignInController', function($scope, $http, $location) {
    
    $scope.submitSignInForm = function() {
        let username = $scope.username.trim();
        let password = $scope.password.trim();

        if (!username || !password) {
            alert("Please fill in both fields!");
            return;
        }
        $http({
            method: "POST",
            url: "../IT-2/signin.php",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            data: `loginId=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        }).then(function(response) {
            let data = response.data;
            if (data.success) {
                localStorage.setItem("userLoggedIn", "true");  
                localStorage.setItem("loginId", username); 

                alert("Sign in successful!");
                $location.path("/"); 
            } else {
                alert("Error: " + data.message);
            }
        }).catch(function(error) {
            console.error("Error:", error);
            alert("An error occurred during sign-in. Please try again.");
        });
    };
});
