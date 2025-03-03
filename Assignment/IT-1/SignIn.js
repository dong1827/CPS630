document.getElementById("signIn").addEventListener("click", function (event) {
    event.preventDefault();

    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Please fill in both fields!");
        return;
    }

    fetch("../IT-2/signin.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `loginId=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem("userLoggedIn", "true");  
            localStorage.setItem("loginId", username); 
        
            alert("Sign in successful!"); 
            window.location.href = "Home.html"; 
        }
         else {
            alert("Error: " + data.message); 
        }
    })
    .catch(error => console.error("Error:", error));
});
