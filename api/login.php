<?php
session_start(); // <<< BẮT ĐẦU PHIÊN LÀM VIỆC (QUAN TRỌNG)
include 'db_connect.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $email = $data['email'];
    $password = $data['password'];

    // --- SỬA Ở ĐÂY: Thêm email, phone, address, dob, avatar vào danh sách lấy ---
    // Bạn có thể dùng SELECT * để lấy tất cả, hoặc liệt kê cụ thể như dưới đây:
    $sql = "SELECT id, password, role, fullname, email, phone, address, dob, avatar FROM users WHERE email = '$email'";
    
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        
        if (password_verify($password, $user['password'])) {
            // LƯU THÔNG TIN VÀO SESSION TRÊN SERVER
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['role'] = $user['role']; // <<< LƯU VAI TRÒ
            
            // Dọn dẹp dữ liệu nhạy cảm trước khi gửi về client
            unset($user['password']); 
            
            echo json_encode([
                "success" => true, 
                "message" => "Đăng nhập thành công!",
                "user" => $user // Biến này giờ đã chứa đủ: email, phone, address...
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Sai mật khẩu!"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Email không tồn tại!"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Thiếu dữ liệu."]);
}

$conn->close();
?>