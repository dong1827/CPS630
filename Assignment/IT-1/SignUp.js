angular.module('OSPApp').controller('SignUpController', function($scope, $http, $location) {
    
    $scope.submitSignupForm = function() {
        let name = $scope.name.trim();
        let email = $scope.email.trim();
        let phone = $scope.phone.trim();
        let address = $scope.address.trim();
        let cityCode = $scope.cityCode.trim();
        let loginId = $scope.loginId.trim();
        let password = $scope.password.trim();
        let confirmPassword = $scope.confirmPassword.trim();

        if (!name || !email || !phone || !address || !cityCode || !loginId || !password || !confirmPassword) {
            alert("All fields are required!");
            return;
        }

        if (!validateFullName(name)) {
            alert("Enter both a first and last name!");
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            alert("Enter a valid email address!");
            return;
        }

        if (isNaN(phone) || phone.length < 10) {
            alert("Enter a valid phone number!");
            return;
        }

        if (!validatePostalCode(cityCode)) {
            alert("Enter a valid Canadian postal code (e.g., L3A 0B1)!");
            return;
        }

        if (password.length < 6) {
            alert("Passwords must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        $http({
            method: "POST",
            url: "../IT-2/signup.php",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            data: `name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&address=${encodeURIComponent(address)}&cityCode=${encodeURIComponent(cityCode)}&loginId=${encodeURIComponent(loginId)}&password=${encodeURIComponent(password)}`
        })
        .then(function(response) {
            const data = response.data;
            alert(data.success ? "Sign-up successful!" : "Error: " + data.message);
            if (data.success) {
                $location.path('/signin');
                localStorage.setItem("loginId", loginId);
            }
        })
        .catch(function(error) {
            console.error("Error:", error);
        });
    };

    function validatePostalCode(postalCode) {
        const regex = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;
        return regex.test(postalCode);
    }

    function validateFullName(name) {
        const names = name.trim().split(" ");
        return names.length >= 2;
    }
});
