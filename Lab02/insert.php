<?php
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "testnew"

$conn = mysqli_connect($servername, $username, $password, $dbname);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$fn = $_POST["first_name"];
$ln = $_POST["last_name"];
$age = $_POST["age"];

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