<?php
// api/update_profile.php
include 'db_connect.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$data = json_decode(file_get_contents("php://input"), true);

if ($data && isset($data['id'])) {
    $id = $data['id'];
    $fullname = $data['fullname'];
    $phone = $data['phone'];
    $address = $data['address'];
    $dob = $data['dob']; // Nhận ngày sinh
    $avatar = $data['avatar'];

    // Cập nhật thông tin người dùng (bao gồm dob)
    $sql = "UPDATE users SET fullname=?, phone=?, address=?, dob=?, avatar=? WHERE id=?";
    $stmt = $conn->prepare($sql);
    
    // sssssi (5 string, 1 integer)
    $stmt->bind_param("sssssi", $fullname, $phone, $address, $dob, $avatar, $id);

    if ($stmt->execute()) {
        // Lấy lại thông tin mới nhất để trả về Client cập nhật LocalStorage
        $result = $conn->query("SELECT * FROM users WHERE id = $id");
        $updatedUser = $result->fetch_assoc();
        
        // Xóa password khỏi response
        unset($updatedUser['password']);

        echo json_encode([
            "success" => true, 
            "message" => "Cập nhật thông tin thành công!",
            "user" => $updatedUser
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Lỗi SQL: " . $conn->error]);
    }
    $stmt->close();
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Thiếu dữ liệu."]);
}
$conn->close();
?>