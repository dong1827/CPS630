<?php
include 'conn.php';

header('Content-Type: application/json');

$data = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    $jsonData = json_decode($json, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        $data = $_POST;
    } else {
        $data = $jsonData;
    }
}

try {
    if (!isset($data['userId']) || !isset($data['amount'])) {
        throw new Exception("Missing required fields: userId or amount");
    }
    
    $userId = intval($data['userId']);
    $subtotal = floatval($data['amount']);
    $deliveryFee = isset($data['deliveryFee']) ? floatval($data['deliveryFee']) : 0;
    $totalPrice = isset($data['total']) ? floatval($data['total']) : ($subtotal + $deliveryFee);
    $paymentCode = mt_rand(100000, 999999); 
    
    $dateIssued = date('Y-m-d');
    $dateReceived = date('Y-m-d', strtotime('+7 days')); 
    
    if ($userId > 0) {
        $userQuery = "SELECT userId FROM User WHERE userId = $userId";
        $userResult = mysqli_query($conn, $userQuery);
        
        if (!$userResult || mysqli_num_rows($userResult) == 0) {
            throw new Exception("User not found. Please sign in again.");
        }
    } else {
        throw new Exception("Invalid user ID");
    }
    
    $storeCode = 1; 
    $shoppingQuery = "INSERT INTO Shopping (storeCode, totalPrice) VALUES ($storeCode, $subtotal)";
    
    if (!mysqli_query($conn, $shoppingQuery)) {
        throw new Exception("Error inserting into Shopping: " . mysqli_error($conn));
    }
    
    $receiptId = mysqli_insert_id($conn);
    
    if (!$receiptId) {
        throw new Exception("Failed to get receipt ID");
    }
    
    $tripId = null;
    $tripPrice = 0;
    
    $tripQuery = "SELECT tripId, price FROM Trip ORDER BY tripId DESC LIMIT 1";
    
    $tripResult = mysqli_query($conn, $tripQuery);
    
    if (!$tripResult || mysqli_num_rows($tripResult) == 0) {
        throw new Exception("No Trip records found. Please create a delivery route first.");
    }
    
    $tripRow = mysqli_fetch_assoc($tripResult);
    $tripId = $tripRow['tripId'];
    $tripPrice = $tripRow['price'];
    

    if (isset($data['deliveryFee']) && $data['deliveryFee'] > 0) {
        $finalPrice = $totalPrice; 
    } else {
        $finalPrice = $subtotal + $tripPrice; 
    }

    $orderQuery = "INSERT INTO OrderTable (dateIssued, dateReceived, totalPrice, paymentCode, userId, tripID, ReceiptID) 
                  VALUES ('$dateIssued', '$dateReceived', $finalPrice, $paymentCode, $userId, $tripId, $receiptId)";
    
    if (!mysqli_query($conn, $orderQuery)) {
        throw new Exception("Error inserting into OrderTable: " . mysqli_error($conn));
    }
    
    $orderId = mysqli_insert_id($conn);
    
    echo json_encode([
        'success' => true,
        'message' => 'Payment processed successfully',
        'orderId' => $orderId,
        'tripId' => $tripId,
        'receiptId' => $receiptId,
        'paymentCode' => $paymentCode,
        'totalPrice' => $finalPrice,
        'dateIssued' => $dateIssued,
        'dateReceived' => $dateReceived
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

mysqli_close($conn);
?>