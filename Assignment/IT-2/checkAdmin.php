<?php 
include 'conn.php';

$loginID = $_POST["username"];

$sql = "SELECT userID FROM User WHERE loginID = \"" . $loginID . "\"";

$result = $conn->query($sql);

$row = $result->fetch_assoc();

if ($row['userID'] == 0) {
    echo "Admin";
}
 