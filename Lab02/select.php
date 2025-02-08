<?php
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "testnew";

$conn = mysqli_connect($servername, $username, $password, $dbname);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$column = $_POST["column2"];
$value = $_POST["value2"];

if($value == ""){
    $sqlInput = "SELECT * FROM StRec";
} else{
    $sqlInput = "SELECT * FROM StRec WHERE $column LIKE '$value'";
}

$sqlResult = $conn->query($sqlInput);

if($sqlResult === false){
    echo "Something went wrong: " . $conn->error;
} elseif ($sqlResult->num_rows === 0){
    echo "No results";
} else{
    echo "<table>";
    echo "<tr>";
    echo "<th>ID</th>";
    echo "<th>First Name</th>";
    echo "<th>Last Name</th>";
    echo "<th>Age</th>";
    echo "</tr>";
    while($row = mysqli_fetch_assoc($sqlResult)){
        echo "<tr>";
        echo "<td>" . $row['id'] . "</td>";
        echo "<td>" . $row['firstname'] . "</td>";
        echo "<td>" . $row['lastname'] . "</td>";
        echo "<td>" . $row['age'] . "</td>";
        echo "</tr>";
    }
    echo "</table>";
}


$conn->close();
?> 