<?php 
include 'conn.php';

if (isset($_POST["sql"])) {
    $sql = $_POST["sql"];
}

$result = $conn->query($sql);

if($result === false){
    echo "Something went wrong: " . $conn->error;
} elseif ($result->num_rows === 0){
    echo '<table>';
    echo '<tr>';
    while ($column = mysqli_fetch_field($result)) {
        echo '<th>' . $column->name . '</th>';
    }
    echo '</tr>';
    
    while($row = mysqli_fetch_assoc($result)) {
        echo '<tr>';
        foreach ($row as $cell) {
            echo '<td>' . htmlspecialchars($cell) . '</td>';
        }
        echo '</tr>';
    }
    echo '</table>';
} else{
    echo "<p>0 results found</p>";
}

$conn->close();
?>