<?php
session_start();
session_unset();    // Xóa tất cả biến session
session_destroy();  // Hủy session
header('Content-Type: application/json');
echo json_encode(["success" => true, "message" => "Đăng xuất thành công"]);
?>