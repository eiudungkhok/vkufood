<?php
// api/add_dish.php
include 'db_connect.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $name = $data['name'];
    $price = $data['price'];
    $image = $data['image'] ?? '';
    $desc = $data['description'] ?? '';
    $ingredients = $data['ingredients'] ?? '';
    
    $stmt = $conn->prepare("INSERT INTO dishes (name, price, image, description, ingredients) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sisss", $name, $price, $image, $desc, $ingredients);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Thêm món ăn thành công!"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Lỗi SQL: " . $conn->error]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ."]);
}
$conn->close();
?>