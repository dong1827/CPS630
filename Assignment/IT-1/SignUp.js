document.getElementById("signup-form").addEventListener("submit", function (event) {
    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let address = document.getElementById("address").value.trim();
    let cityCode = document.getElementById("cityCode").value.trim();
    let loginId = document.getElementById("loginId").value.trim();
    let password = document.getElementById("password").value.trim();
    let confirmPassword = document.getElementById("confirm-password").value.trim();

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
        alert("Passwords must be at least 6 characters")
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    fetch("../IT-2/signup.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&address=${encodeURIComponent(address)}&cityCode=${encodeURIComponent(cityCode)}&loginId=${encodeURIComponent(loginId)}&password=${encodeURIComponent(password)}`
    })
    .then(response => response.json())
    .then(data => {
        alert(data.success ? "Sign-up successful!" : "Error: " + data.message);
        if (data.success) {
            window.location.href = "SignIn.html";
            localStorage.setItem("loginId", loginId);
        }
    })
    .catch(error => console.error("Error:", error));
});

function validatePostalCode(postalCode) {
    const regex = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;
    return regex.test(postalCode);
}

function validateFullName(name) {
    const names = name.trim().split(" ");
    return names.length >= 2; 
}