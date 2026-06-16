<?php
// api/place_order.php (ĐÃ SỬA LỖI BINDING ĐỊA CHỈ)
include 'db_connect.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Hàm tạo mã đơn hàng ngẫu nhiên (Cho cột 'code')
function generateOrderCode($length = 10) {
    $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $code = '';
    for ($i = 0; $i < $length; $i++) {
        $code .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $code;
}

$data = json_decode(file_get_contents("php://input"), true);

// KIỂM TRA DỮ LIỆU CẦN THIẾT
if (!$data || !isset($data['name']) || !isset($data['phone']) || !isset($data['address']) || !isset($data['total']) || !isset($data['cart'])) {
    http_response_code(400);
    die(json_encode(["success" => false, "message" => "Dữ liệu đặt hàng không hợp lệ."]));
}

try {
    // 1. Lấy dữ liệu và tạo code
    $orderCode = generateOrderCode(); 
    $customer_name = $data['name'];
    $customer_phone = $data['phone'];
    $customer_address = $data['address']; // Dùng cho địa chỉ giao hàng chính
    $total_money = $data['total'];
    $items = $data['cart'];
    
    $conn->begin_transaction();

    // 2. CÂU LỆNH INSERT: CHỈ DÙNG 5 CỘT DỮ LIỆU CỦA BẠN + 2 CỘT TỰ ĐỘNG
    $sql_order = "INSERT INTO orders (code, customer_name, customer_phone, customer_address, total_money, order_date, created_at) 
                  VALUES (?, ?, ?, ?, ?, NOW(), NOW())"; 
    
    $stmt = $conn->prepare($sql_order);
    
    // FIX RÀNG BUỘC: Thay "sssis" thành "ssssi"
    // Ràng buộc tham số (5 tham số): s(code), s(name), s(phone), s(customer_address), i(total_money)
    $stmt->bind_param("ssssi", 
        $orderCode, 
        $customer_name, 
        $customer_phone, 
        $customer_address, // <-- Đã được xử lý là chuỗi (s)
        $total_money
    );
    
    if (!$stmt->execute()) {
        throw new Exception("Lỗi SQL khi đặt đơn hàng: " . $conn->error);
    }

    $order_id = $conn->insert_id;

    // 3. Chèn chi tiết món ăn (order_items)
    $item_stmt = $conn->prepare("INSERT INTO order_items (order_id, dish_name, quantity, price) VALUES (?, ?, ?, ?)");
    
    foreach ($items as $item) {
        $dish_name = $item['name'];
        $quantity = $item['quantity'];
        $price = $item['price'];

        $item_stmt->bind_param("isii", $order_id, $dish_name, $quantity, $price);
        
        if (!$item_stmt->execute()) {
            throw new Exception("Lỗi SQL khi chèn chi tiết món ăn: " . $item_stmt->error);
        }
    }

    $conn->commit();
    echo json_encode(["success" => true, "message" => "Đặt hàng thành công!", "order_id" => $order_id, "order_code" => $orderCode]);

} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Lỗi Server: " . $e->getMessage()]);
}

$conn->close();
?>