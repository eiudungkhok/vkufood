<?php
// api/get_orders.php (Phiên bản an toàn, lấy tất cả đơn hàng)
include 'db_connect.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    // 1. Lấy danh sách đơn hàng (Sắp xếp mới nhất lên đầu)
    $sql = "SELECT * FROM orders ORDER BY id DESC";
    $result = $conn->query($sql);

    $orders = [];

    if ($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $order_id = $row['id'];
            
            // 2. Lấy chi tiết món ăn cho từng đơn hàng
            // Lưu ý: Sử dụng LEFT JOIN hoặc truy vấn riêng để đảm bảo không lỗi nếu bảng items trống
            $items_sql = "SELECT dish_name, quantity, price FROM order_items WHERE order_id = $order_id";
            $items_result = $conn->query($items_sql);
            
            $items = [];
            if ($items_result && $items_result->num_rows > 0) {
                while($item = $items_result->fetch_assoc()) {
                    $items[] = $item;
                }
            }
            
            // Gán danh sách món vào đơn hàng
            $row['items'] = $items;
            $orders[] = $row;
        }
    }

    echo json_encode($orders);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}

$conn->close();
?>