<?php
include 'conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $action = isset($_POST['action']) ? $_POST['action'] : '';
    
    if ($action === 'create_trip') {

        $srcCode = isset($_POST['srcCode']) ? $_POST['srcCode'] : '';
        $dstCode = isset($_POST['dstCode']) ? $_POST['dstCode'] : '';
        $distance = isset($_POST['distance']) ? floatval($_POST['distance']) : 0;
        $price = isset($_POST['price']) ? floatval($_POST['price']) : 0;
        

        if (empty($srcCode) || empty($dstCode) || $distance <= 0 || $price <= 0) {
            echo json_encode([
                'success' => false,
                'message' => 'Invalid trip data: missing or invalid parameters'
            ]);
            exit;
        }
        
        try {
            // Get an available truck
            $truckQuery = "SELECT truckId FROM Truck WHERE availabilityCode = 1 LIMIT 1";
            $truckResult = $conn->query($truckQuery);
            
            if ($truckResult && $truckResult->num_rows > 0) {
                $truck = $truckResult->fetch_assoc();
                $truckId = $truck['truckId'];
                
                // Create the trip in the database
                $insertQuery = "INSERT INTO Trip (srcCode, dstCode, distance, truckId, price) 
                               VALUES (?, ?, ?, ?, ?)";
                $stmt = $conn->prepare($insertQuery);
                
                if ($stmt) {
                    $stmt->bind_param("ssdid", $srcCode, $dstCode, $distance, $truckId, $price);
                    
                    if ($stmt->execute()) {
                        $tripId = $conn->insert_id;
                        
                        $updateQuery = "UPDATE Truck SET availabilityCode = 0 WHERE truckId = ?";
                        $updateStmt = $conn->prepare($updateQuery);
                        
                        if ($updateStmt) {
                            $updateStmt->bind_param("i", $truckId);
                            $updateStmt->execute();
                        }
                        
                        $response = [
                            'success' => true,
                            'tripId' => $tripId
                        ];

                        echo json_encode($response);
                    } else {
                        throw new Exception("Execute failed: " . $stmt->error);
                    }
                } else {
                    throw new Exception("Prepare failed: " . $conn->error);
                }
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'No trucks available for delivery'
                ]);
            }
        } catch (Exception $e) {

            echo json_encode([
                'success' => false,
                'message' => 'Database error: ' . $e->getMessage()
            ]);
        }
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Unknown action: ' . $action
        ]);
    }
} else {
    header('Location: Delivery.html');
    exit;
}