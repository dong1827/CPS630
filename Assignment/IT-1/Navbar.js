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

    fetch("../IT-2/checkAdmin.php", {
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            username: localStorage.getItem("loginId")
        })

    })
    .then(response => response.text())
    .then(data => {
        if (data ===  "Admin") {
            document.getElementById("dbM").classList.toggle("show");
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

function toggleDropdown() {
    document.getElementById("dbDropDown").classList.toggle("show");
}
  