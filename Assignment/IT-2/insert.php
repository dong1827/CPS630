<?php 
include 'conn.php';

$tableColumns = [
    'User' => [
        'required' => ['name', 'telNo', 'email', 'address', 'cityCode', 'loginId', 'password'],
        'optional' => ['balance']
    ],
    'Truck' => [
        'required' => ['truckCode', 'availabilityCode'],
        'optional' => []
    ],
    'Trip' => [
        'required' => ['srcCode', 'dstCode', 'distance', 'truckId', 'price'],
        'optional' => []
    ],
    'Shopping' => [
        'required' => ['storeCode', 'totalPrice'],
        'optional' => []
    ],
    'OrderTable' => [
        'required' => ['dateIssued', 'totalPrice', 'paymentCode', 'userId', 'tripID', 'ReceiptID'],
        'optional' => ['dateReceived']
    ],
    'Item' => [
        'required' => ['itemName', 'price', 'departmentCode'],
        'optional' => ['madeIn']
    ]
];

if (!isset($_POST['table'])) {
    echo 'Error: table is not specified';
    die;
}

$table = $_POST['table'];

if (!isset($tableColumns[$table])) {
    echo 'Error: table does not exists';
    die;
}

$requiredFields = $tableColumns[$table]['required'];
$optionalFields = $tableColumns[$table]['optional'];

foreach ($requiredFields as $field) {
    if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
        echo "Error: Missing required field: $field";
        die;
    }
}

$columns = [];
$values = [];
$types = '';

foreach ($requiredFields as $field) {
    $columns[] = $field;
    $values[] = $_POST[$field];
}

foreach ($optionalFields as $field) {
    if (isset($_POST[$field]) && !empty(trim($_POST[$field]))) {
        $columns[] = $field;
        $values[] = $_POST[$field];
    } 
}

$sql = "Insert into " . $table . "(";

foreach ($columns as $col) {
    $sql .= $col . ", ";
}

$temp = $sql;
$sql = substr_replace($temp, ") ", -2);

$sql .= "VALUES (";

foreach ($values as $val) {
    $sql .= "\"" . $val . "\", ";
}

$temp = $sql;
$sql = substr_replace($temp, ");", -2);


if ($conn->query($sql) === true) {
    echo "Action succeed";
}
else {
    echo "Error " . $conn->error;
}

$conn->close();
?>  
