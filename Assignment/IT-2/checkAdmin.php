<?php 
include 'conn.php';

$jsonInput = file_get_contents("php://input");
$data = json_decode($jsonInput, true);

$loginID = $data["username"];

$sql = "SELECT isAdmin FROM User WHERE loginID = \"" . $loginID . "\"";

$result = $conn->query($sql);

$row = $result->fetch_assoc();

if ($row['isAdmin'] == 1) {
    echo "Admin";
}
 