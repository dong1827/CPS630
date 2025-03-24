<?php
include 'db_connect.php';

function generateRandomSalt() {
    return bin2hex(random_bytes(6)); // Generates a random 12-character salt
}

function customHash($password) {
    $reversed = strrev($password);  
    $shifted = '';
    for ($i = 0; $i < strlen($reversed); $i++) {
        $shifted .= chr(ord($reversed[$i]) + 5);  
    }
    return $shifted;
}

function insertUser($username, $password, $conn) {
    $salt = generateRandomSalt();
    $hashedPassword = customHash($password . $salt);
    $sql = "INSERT INTO lab8 (Username, Password, Salt) VALUES (?, ?, ?)";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "sss", $username, $hashedPassword, $salt);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);
}

function usernameExists($username, $conn) {
    $sql = "SELECT UserID FROM lab8 WHERE Username=?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "s", $username);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_store_result($stmt);
    $result = mysqli_stmt_num_rows($stmt);
    mysqli_stmt_close($stmt);
    return $result > 0; 
}

function validateUser($username, $password, $conn) {
    $sql = "SELECT Password, Salt FROM lab8 WHERE Username=?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "s", $username);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $storedPassword, $salt);
    mysqli_stmt_fetch($stmt);
    mysqli_stmt_close($stmt);

    return ($storedPassword === customHash($password . $salt));
}
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];  
    $password = $_POST['password'];  

    if (usernameExists($username, $conn)) {
        if (validateUser($username, $password, $conn)) {
            echo "Login successful.<br>";
        } else {
            echo "Incorrect password.<br>";
        }
    } else {
        insertUser($username, $password, $conn);
        echo "User $username created successfully.<br>";
    }
}
?>

<form method="POST">
    Username: <input type="text" name="username"><br>
    Password: <input type="password" name="password"><br>
    <input type="submit" value="Submit">
</form>
