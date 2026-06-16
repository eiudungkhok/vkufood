<?php
// api/announcements.php (Controller Thông báo: Đọc, Thêm, Xóa)
include 'db_connect.php'; // Đảm bảo rằng file này đã kết nối được với $conn

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$data = json_decode(file_get_contents("php://input"), true);
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($data['action']) ? $data['action'] : ''; 

try {
    if ($method === 'GET') {
        // LẤY TẤT CẢ THÔNG BÁO HIỆN HÀNH CHO TRANG CHỦ & ADMIN
        $sql = "SELECT id, content FROM announcements WHERE is_active = 1 ORDER BY created_at DESC";
        $result = $conn->query($sql);
        $notes = [];
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                // Trả về cả ID (để Admin xóa) và content (để hiển thị)
                $notes[] = ['id' => $row['id'], 'content' => $row['content']];
            }
        }
        echo json_encode($notes);
        exit();

    } elseif ($method === 'POST') {
        // XỬ LÝ THÊM HOẶC XÓA (ADMIN ACTION)
        
        if ($action === 'add' && isset($data['content'])) {
            // THÊM MỚI
            $content = $data['content'];
            $stmt = $conn->prepare("INSERT INTO announcements (content) VALUES (?)");
            $stmt->bind_param("s", $content);
            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Thêm thông báo thành công!"]);
            } else {
                throw new Exception("Lỗi SQL: " . $conn->error);
            }
        } elseif ($action === 'delete' && isset($data['id'])) {
            // XÓA HẲN
            $id = $data['id'];
            $stmt = $conn->prepare("DELETE FROM announcements WHERE id = ?");
            $stmt->bind_param("i", $id);
            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Xóa thông báo thành công!"]);
            } else {
                throw new Exception("Lỗi SQL: " . $conn->error);
            }
        } else {
             http_response_code(400);
             echo json_encode(["success" => false, "message" => "Hành động hoặc tham số không hợp lệ."]);
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$conn->close();
?>