document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.getElementById("logout-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("authToken"); 
            localStorage.removeItem("userData"); 
            window.location.href = "SignIn.html";
        });
    }
});
