<?php 
include 'conn.php';

if (!isset($_POST["sql"])) {
    echo 'Error: Enter a sql statement';
    die;
}

$sql = $_POST["sql"];
if ($conn->query($sql) === true) {
    echo "Action succeed";
}
else {
    echo "Error " . $conn->error;
}

$conn->close();
?>  