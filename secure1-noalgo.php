<?php
include 'db_connect.php';

function insertUser($username, $password, $conn) {
    $sql = "INSERT INTO lab8 (Username, Password) VALUES (?, ?)";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "ss", $username, $password);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);
}

function validateUser($username, $password, $conn) {
    $sql = "SELECT UserID FROM lab8 WHERE Username=? AND Password=?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "ss", $username, $password);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_store_result($stmt);
    $result = mysqli_stmt_num_rows($stmt);
    mysqli_stmt_close($stmt);
    return $result > 0;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];  
    $password = $_POST['password'];  

    insertUser($username, $password, $conn);
    echo "User $username inserted successfully.<br>";
}
?>

<form method="POST">
    Username: <input type="text" name="username"><br>
    Password: <input type="password" name="password"><br>
    <input type="submit" value="Submit" action="login">
</form>
