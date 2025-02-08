<?php
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "testnew";

$conn = mysqli_connect($servername, $username, $password, $dbname);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if (isset($_POST["first_name"])) {
    $fn = $_POST["first_name"];
}

if (isset($_POST["last_name"])) {
    $ln = $_POST["last_name"];
}

if (isset($_POST["age"])) {
    $age = $_POST["age"];
}

$sql = "INSERT INTO StRec (firstname, lastname, age)
VALUES ('$fn', '$ln', '$age')";

if ($conn->query($sql) === TRUE) {
    echo "New record added";
}
else {
    echo "Error " . $conn->error;
}

$conn->close();
?>