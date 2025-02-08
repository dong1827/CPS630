<?php
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "testnew";

$conn = mysqli_connect($servername, $username, $password, $dbname);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$column = $_POST["column"];
$value = $_POST["value"];

$sql = "";

if ($column == "age") {
    $sql = "DELETE FROM StRec WHERE age = $value";
}
else {
    $sql = "DELETE FROM StRec WHERE $column LIKE '$value'";
}

if ($conn->query($sql) === TRUE) {
    echo "Record deleted successfully";
} else {
    echo "Error deleting record: " . $conn->error;
}

$conn->close();
?> 