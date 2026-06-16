<?php
// api/register.php (ĐÃ CẬP NHẬT ĐẦY ĐỦ CÁC TRƯỜNG)
include 'db_connect.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $fullname = $data['fullname'];
    $email = $data['email'];
    $password = $data['password'];
    // Lấy thêm các thông tin phụ (nếu có)
    $phone = $data['phone'] ?? '';
    $address = $data['address'] ?? '';
    $dob = $data['dob'] ?? NULL; // Ngày sinh
    $role = $data['role'] ?? 'user';
    
    // Kiểm tra email đã tồn tại chưa
    $check_sql = "SELECT id FROM users WHERE email = ?";
    $check_stmt = $conn->prepare($check_sql);
    $check_stmt->bind_param("s", $email);
    $check_stmt->execute();
    if ($check_stmt->get_result()->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Email này đã được sử dụng!"]);
        exit();
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Câu lệnh INSERT đầy đủ
    $sql = "INSERT INTO users (fullname, email, password, phone, address, dob, role) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    
    // sssssss (7 chuỗi)
    $stmt->bind_param("sssssss", $fullname, $email, $hashed_password, $phone, $address, $dob, $role);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Đăng ký thành công!"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Lỗi SQL: " . $conn->error]);
    }
    $stmt->close();
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Thiếu dữ liệu."]);
}
$conn->close();
?>