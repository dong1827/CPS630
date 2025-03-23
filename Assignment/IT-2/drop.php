<?php 
include 'conn.php';

mysqli_query($conn, "SET FOREIGN_KEY_CHECKS = 0");

$tables = ['User', 'Truck', 'Trip', 'Shopping', 'OrderTable', 'Item', 'Reviews'];

foreach ($tables as $table) {
    $sql = "DROP TABLE IF EXISTS `$table`";     
    
    if (mysqli_query($conn, $sql)) {
        echo "Table $table dropped successfully.<br>";
    } else {
        echo "Error dropping table $table: " . mysqli_error($conn) . "<br>";
    }
}

mysqli_query($conn, "SET FOREIGN_KEY_CHECKS = 1");

mysqli_close($conn);
?>