$(document).ready(function() {
    $('#sqlForm').submit(function(e) {
        e.preventDefault();
        fetchData();
    });
});

function fetchSQL() {
    const sql = $('#sql').value;
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
    const sql = $('#sql').value;
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

