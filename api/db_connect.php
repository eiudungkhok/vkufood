<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$servername = "localhost";
$username = "root";     // Tên đăng nhập mặc định của XAMPP
$password = "";         // Mật khẩu mặc định của XAMPP là rỗng
$dbname = "vkufood_db"; // Tên database bạn vừa tạo

$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8"); // Để không bị lỗi font tiếng Việt

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Kết nối thất bại: " . $conn->connect_error]));
}
?>