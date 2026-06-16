<?php
include 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(["success" => false, "message" => "Thiếu dữ liệu"]); exit;
}

$user_id = intval($data['user_id'] ?? 0);
$address = trim($data['address'] ?? '');
$total = intval($data['total'] ?? 0);
$items = $data['items'] ?? [];
if ($user_id <= 0 || $total <= 0 || empty($items)) {
    echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ"]); exit;
}

$conn->query("CREATE TABLE IF NOT EXISTS orders (id INT AUTO_INCREMENT PRIMARY KEY, code VARCHAR(32) UNIQUE, user_id INT, address VARCHAR(255), total INT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)");
$conn->query("CREATE TABLE IF NOT EXISTS order_items (id INT AUTO_INCREMENT PRIMARY KEY, order_id INT, name VARCHAR(255), price INT, quantity INT, image TEXT)");

$code = 'VKU' . date('Ymd') . strtoupper(substr(md5(uniqid('', true)), 0, 6));

$stmt = $conn->prepare("INSERT INTO orders (code, user_id, address, total) VALUES (?, ?, ?, ?)");
$stmt->bind_param('sisi', $code, $user_id, $address, $total);
if (!$stmt->execute()) { echo json_encode(["success" => false, "message" => "Lỗi tạo đơn hàng"]); exit; }
$order_id = $stmt->insert_id;
$stmt->close();

$itemStmt = $conn->prepare("INSERT INTO order_items (order_id, name, price, quantity, image) VALUES (?, ?, ?, ?, ?)");
foreach ($items as $it) {
    $name = $it['name'] ?? '';
    $price = intval($it['price'] ?? 0);
    $quantity = intval($it['quantity'] ?? 0);
    $image = $it['image'] ?? '';
    if ($name && $price > 0 && $quantity > 0) {
        $itemStmt->bind_param('isiii', $order_id, $name, $price, $quantity, $image);
        $itemStmt->execute();
    }
}
$itemStmt->close();

echo json_encode(["success" => true, "code" => $code, "order_id" => $order_id]);
$conn->close();
?>