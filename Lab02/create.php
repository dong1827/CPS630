<?php
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "testnew"

$conn = mysqli_connect($servername, $username, $password, $dbname);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error())
}

$sql = "CREATE TABLE StRec (
id INT(6) AUTO_INCREMENT PRIMARY KEY,
firstname VARCHAR(30) NOT NULL,
lastname VARCHAR(30) NOT NULL,
age INT(3) NOT NULL
)";

if (mysqli_query($conn, $sql)) {
    echo "Table created successfully"
}
else {
    echo "Error creating table: " . mysqli_error($conn);
}

mysqli_close($conn)
?>