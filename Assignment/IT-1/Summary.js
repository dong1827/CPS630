document.addEventListener("DOMContentLoaded", function () {
    let cart = localStorage.getItem("cart");
    
    fetch("../IT-2/sql.php", {
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
        let priceData = [];

        for (let i = 1; i < data.rows.length; i++) { 
            priceDataData.push(table.rows[i].cells[0].innerText);
        }

        console.log(priceDataData);
        })
    .catch((error) => {
        console.error('Error:', error);
    });
});