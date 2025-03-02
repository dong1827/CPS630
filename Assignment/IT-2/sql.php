<?php 
include 'conn.php';

if (isset($_POST["sql"])) {
    $sql = $_POST["sql"];
}

if ($conn->query($sql) === true) {
    echo "Action succeed";
}
else {
    echo "Error " . $conn->error;
}

$conn->close();
?>  