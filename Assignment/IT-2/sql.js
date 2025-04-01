$(document).ready(function() {
    $('#sqlForm').submit(function(e) {
        e.preventDefault();
        fetchData();
    });
});

function fetchSQL(sql) {
    $('#result').html("<p>loading...</p>");
    $.ajax({
        url: '../IT-2/sql.php',
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

function updateSQL() {
    const table = $('#table').val();
    const setCol = $('#setCol').val();
    const setVal = $('#setVal').val();
    const whereCol = $('#whereCol').val(); 
    const whereVal = $('#whereVal').val(); 

    const sql = `UPDATE ${table} SET ${setCol} = '${setVal}' WHERE ${whereCol} = '${whereVal}'`;
    fetchSQL(sql);
}

function deleteSQL() {
    const table = $('#table').val();
    const col = $('#col').val();
    const val = $('#val').val();

    const sql = `DELETE FROM ${table} WHERE ${col} = '${val}'`;
    fetchSQL(sql);
}

function insertSQL() {
    const table = $('#table').val();
    const col = $('#col').val();
    let val = $('#val').val();

    let newVal = val.replace(", ", "', '");
    const sql = `INSERT INTO ${table} (${col}) VALUES ('${newVal}')`;
    fetchSQL(sql);
}

function selectSQL() {
    const table = $('#table').val();
    const columns = $('#columns').val() || '*';
    const whereCol = $('#whereCol').val();
    const whereVal = $('#whereVal').val();

    let sql = `SELECT ${columns} FROM ${table}`;

    if (whereCol && whereVal) {
        sql += ` WHERE ${whereCol} = '${whereVal}'`;
    }

    $('#result').html("<p>loading...</p>");
    $.ajax({
        url: '../IT-2/select.php',
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
