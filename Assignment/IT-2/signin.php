<?php
header("Content-Type: application/json");
require_once "conn.php"; 
$response = ["success" => false];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $loginId = trim($_POST["loginId"]);
    $password = trim($_POST["password"]);

    if (empty($loginId) || empty($password)) {
        $response["message"] = "Username and password are required!";
        echo json_encode($response);
        exit;
    }

    $stmt = $conn->prepare("SELECT * FROM User WHERE loginId = ?");
    $stmt->bind_param("s", $loginId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user["password"])) {
            $response["success"] = true;
            $response["message"] = "Login successful!";
        } else {
            $response["message"] = "Incorrect password!";
        }
    } else {
        $response["message"] = "User not found!";
    }

    $stmt->close();
    $conn->close();
}

echo json_encode($response);
?>
