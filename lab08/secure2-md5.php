<?php
include 'db_connect.php';

function customHash($password) {
    $reversed = strrev($password);  
    $shifted = '';
    for ($i = 0; $i < strlen($reversed); $i++) {
        $shifted .= chr(ord($reversed[$i]) + 5);  
    }
    return $shifted;
}

function insertUser($username, $password, $conn) {
    $hashedPassword = customHash($password);  
    $sql = "INSERT INTO lab8 (Username, Password) VALUES (?, ?)";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "ss", $username, $hashedPassword);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);
}

function validateUser($username, $password, $conn) {
    $sql = "SELECT Password FROM lab8 WHERE Username=?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "s", $username);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $storedHash);
    mysqli_stmt_fetch($stmt);
    mysqli_stmt_close($stmt);

    if ($storedHash && customHash($password) === $storedHash) {
        return true;  
    } else {
        return false;  
    }
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
