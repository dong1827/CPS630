<?php
header("Content-Type: application/json");

include "conn.php"; 

$sql = "SELECT itemId, itemName, price, imagePath FROM Item";
$result = $conn->query($sql);

$items = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $items[] = $row;
    }
}

echo json_encode($items, JSON_PRETTY_PRINT);

$conn->close();
?>
