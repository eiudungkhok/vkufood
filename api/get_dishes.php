<?php
include 'db_connect.php';

// Truy vấn lấy tất cả món ăn, sắp xếp mới nhất lên đầu
$sql = "SELECT * FROM dishes ORDER BY id DESC";
$result = $conn->query($sql);

$dishes = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Chuyển chuỗi ingredients thành mảng (nếu cần xử lý thêm)
        // Ở đây ta giữ nguyên hoặc client tự split
        $dishes[] = $row;
    }
}

// Trả về JSON
echo json_encode($dishes);

$conn->close();
?>