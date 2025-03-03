document.addEventListener("DOMContentLoaded", function () {
    
    fetch("navbar.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load navbar");
            }
            return response.text();
        })
      .then(html => {
            document.getElementById("navbar-container").innerHTML = html;
        
            if (localStorage.getItem("userLoggedIn") === "true") {
                document.getElementById("signin-link").style.display = "none";
                document.getElementById("signup-link").style.display = "none";
                let logoutLink = document.getElementById("logout-link");
                logoutLink.style.display = "inline-block";
                logoutLink.addEventListener("click", function (e) {
                    e.preventDefault();
                    localStorage.removeItem("userLoggedIn");
                    localStorage.removeItem("loginId");
                    window.location.href = "signin.html";
                });
            }
      })
      .catch(error => console.error("Error loading navbar:", error));
});
  