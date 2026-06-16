<?php
// api/update_dish.php
include 'db_connect.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$data = json_decode(file_get_contents("php://input"), true);

if ($data && isset($data['id'])) {
    $id = $data['id'];
    $name = $data['name'];
    $price = $data['price'];
    $image = $data['image'];
    $desc = $data['description'];
    $ingredients = $data['ingredients'];
    
    $stmt = $conn->prepare("UPDATE dishes SET name=?, price=?, image=?, description=?, ingredients=? WHERE id=?");
    $stmt->bind_param("sisssi", $name, $price, $image, $desc, $ingredients, $id); 
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Cập nhật món ăn thành công!"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Lỗi SQL: " . $conn->error]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Dữ liệu hoặc ID món ăn không hợp lệ."]);
}
$conn->close();
?>