$(document).ready(function() {
    $('#sqlForm').submit(function(e) {
        e.preventDefault();
        fetchData();
    });
});

function fetchSQL() {
    const sql = $('#sql').val();
    $('#result').html("<p>loading...</p>");
    $.ajax({
        url: 'sql.php',
        method: 'POST',
        dataType: 'html',
        data: { 
            sql: sql 
        },
        success: function(response) {
            $('#result').html(response);
        }
    });
}

function selectSQL() {
    const sql = $('#sql').val();
    $('#result').html("<p>loading...</p>");
    $.ajax({
        url: 'select.php',
        method: 'POST',
        dataType: 'html',
        data: { 
            sql: sql 
        },
        success: function(response) {
            $('#result').html(response);
        }
    });
}

function fetchOrder() {
    const user = $('#userID').val(); 
    const order = $('#orderID').val();

    let sql = "SELECT * FROM OrderTable ";
    if(user) {
        sql += "WHERE userID = " + user;
        if(order) {
            sql += " AND WHERE id = " + order;
        }
    }
    else if (order) {
        sql += "WHERE id = " + order;
    }
    else {
        alert("Please enter at least one of user ID or order Id");
        return
    }

    $.ajax({
        url: 'select.php',
        method: 'POST',
        dataType: 'html',
        data: { 
            sql: sql 
        },
        success: function(response) {
            $('#result').html(response);
        }
    });
}
