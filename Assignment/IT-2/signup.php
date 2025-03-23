<?php
header("Content-Type: application/json");
require_once "conn.php"; 

$response = ["success" => false];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = trim($_POST["name"]);
    $telNo = trim($_POST["phone"]);
    $email = trim($_POST["email"]);
    $address = trim($_POST["address"]);
    $cityCode = trim($_POST["cityCode"]);
    $loginId = trim($_POST["loginId"]);
    $password = trim($_POST["password"]);

    if (empty($name) || empty($telNo) || empty($email) || empty($address) || empty($cityCode) || empty($loginId) || empty($password)) {
        $response["message"] = "All fields are required!";
        echo json_encode($response);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response["message"] = "Invalid email format!";
        echo json_encode($response);
        exit;
    }

    if (!preg_match("/^[0-9]{10,15}$/", $telNo)) {
        $response["message"] = "Invalid phone number!";
        echo json_encode($response);
        exit;
    }

    $salt = base64_encode(random_bytes(12));
    $hashedPassword = md5($password.$salt);

    $stmt = $conn->prepare("INSERT INTO User (name, telNo, email, address, cityCode, loginId, password, salt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssss", $name, $telNo, $email, $address, $cityCode, $loginId, $hashedPassword, $salt);

    if ($stmt->execute()) {
        $response["success"] = true;
    } else {
        $response["message"] = "Error: " . $conn->error;
    }

    $stmt->close();
    $conn->close();
}

echo json_encode($response);
?>
