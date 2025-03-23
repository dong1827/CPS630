<?php
require 'conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT itemId, itemName FROM Item";
    $result = $conn->query($sql);

    $items = [];

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
        }

        header('Content-Type: application/json');
        echo json_encode($items);
    } else {
        echo json_encode(array("message" => "No items found."));
    }
}
elseif (isset($_POST["id"])) {
    $id = intval($_POST["id"]);

    $sql = "SELECT username, comment, rating FROM Reviews WHERE itemId = $id";
    $result = $conn->query($sql);

    $reviews = [];

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $reviews[] = $row; 
        }

        header('Content-Type: application/json');
        echo json_encode($reviews);
    } else {
        echo json_encode(array("message" => "No reviews found for this item."));
    }
}
elseif (isset($_POST["user"])) {
    $item = $_POST["itemID"];
    $username = $_POST["username"];
    $comment = $_POST["comment"];
    $rating = $_POST["rating"];

    $sql = "INSERT INTO Reviews (itemId, username, comment, rating)
            VALUES ($item, $username, '$comment', $rating)";

    if (mysqli_query($conn, $sql)) {
        echo json_encode(array("message" => "Review added successfully"));
    } else {
        echo json_encode(array("error" => "Error adding review: " . mysqli_error($conn)));
    }
}

$conn->close();
?>
