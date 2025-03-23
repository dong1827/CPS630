9<?php 
include 'conn.php';

$sql = "CREATE TABLE User (
    userId INT(6) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    telNo VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    address VARCHAR(100) NOT NULL,
    cityCode VARCHAR(8) NOT NULL,
    loginId VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    balance FLOAT(10,2),
    salt VARCHAR(255) NOT NULL
)";

if (mysqli_query($conn, $sql)) {
    echo "Table created successfully";
}
else {
    echo "Error creating table: " . mysqli_error($conn);
}

$sql = "CREATE TABLE Truck (
    truckId INT(6) AUTO_INCREMENT PRIMARY KEY,
    truckCode VARCHAR(50) NOT NULL,
    availabilityCode VARCHAR(20) NOT NULL
)";

if (mysqli_query($conn, $sql)) {
    echo "Table created successfully";
}
else {
    echo "Error creating table: " . mysqli_error($conn);
}

$sql = "CREATE TABLE Trip (
    tripId INT(6) AUTO_INCREMENT PRIMARY KEY,
    srcCode VARCHAR(8) NOT NULL,
    dstCode VARCHAR(8) NOT NULL,
    distance FLOAT(10, 2) NOT NULL,
    truckId INT(6) NOT NULL,
    price FLOAT(10, 2) NOT NULL,
    FOREIGN KEY (truckId) REFERENCES Truck(truckId)
)";

if (mysqli_query($conn, $sql)) {
    echo "Table created successfully";
}
else {
    echo "Error creating table: " . mysqli_error($conn);
}

$sql = "CREATE TABLE Shopping (
    receiptId INT(6) AUTO_INCREMENT PRIMARY KEY,
    storeCode INT(6) NOT NULL,
    totalPrice FLOAT(10, 2) NOT NULL
)";

if (mysqli_query($conn, $sql)) {
    echo "Table created successfully";
}
else {
    echo "Error creating table: " . mysqli_error($conn);
}

$sql = "CREATE TABLE OrderTable (
    id INT(6) AUTO_INCREMENT PRIMARY KEY,
    dateIssued DATE NOT NULL,
    dateReceived DATE,
    totalPrice FLOAT(10, 2) NOT NULL,
    paymentCode INT(15) NOT NULL,
    userId INT(6),
    tripID INT(6),
    ReceiptID INT(6),
    FOREIGN KEY (userId) REFERENCES User(userId),
    FOREIGN KEY (tripID) REFERENCES Trip(tripId),
    FOREIGN KEY (receiptID) REFERENCES Shopping(receiptId)
    )";
    
if (mysqli_query($conn, $sql)) {
    echo "Table created successfully";
}
else {
    echo "Error creating table: " . mysqli_error($conn);
}

$sql = "CREATE TABLE Item (
    itemId INT(6) AUTO_INCREMENT PRIMARY KEY,
    itemName VARCHAR(100) NOT NULL,
    price FLOAT(10,2) NOT NULL,
    madeIn VARCHAR(50),
    departmentCode INT(6) NOT NULL,
    ImagePath VARCHAR(50)
)";
    
if (mysqli_query($conn, $sql)) {
    echo "Table created successfully";
}
else {
    echo "Error creating table: " . mysqli_error($conn);
}

$sql = "CREATE TABLE Reviews (
    itemId INT(6) NOT NULL,
    username VARCHAR(50) NOT NULL,
    comment TEXT,
    rating int(5),
    PRIMARY KEY (itemId, username),
    FOREIGN KEY (itemId) REFERENCES Item(itemId),
    FOREIGN KEY (username) REFERENCES User(loginId)
)";
    
if (mysqli_query($conn, $sql)) {
    echo "Table created successfully";
}
else {
    echo "Error creating table: " . mysqli_error($conn);
}
    
mysqli_close($conn);