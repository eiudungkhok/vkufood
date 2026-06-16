-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 16, 2026 lúc 06:08 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `vkufood_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
  `content` text NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `announcements`
--

INSERT INTO `announcements` (`id`, `content`, `is_active`, `created_at`) VALUES
(7, 'Giáng sinh vui vẻ nha mọi người', 1, '2026-01-09 01:01:36');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dishes`
--

CREATE TABLE `dishes` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `ingredients` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `dishes`
--

INSERT INTO `dishes` (`id`, `name`, `price`, `image`, `description`, `ingredients`, `created_at`) VALUES
(1, 'Combo Burger + Pepsi', 99000, 'css/burgerpepsi.JPG', 'Burger bò phô mai kèm Pepsi mát lạnh.', 'Bánh burger, Thịt bò, Phô mai, Xà lách, Pepsi', '2025-11-18 15:26:47'),
(3, 'Mì cay hải sản', 49000, 'css/micayhaisan.JPG', 'Mì cay cấp độ vừa với hải sản tươi.', 'Mì, Tôm, Mực, Ớt, Rau', '2025-11-18 15:26:47'),
(4, 'Gà rán giòn', 45000, 'css/garangion.JPG', 'Gà rán vỏ giòn, thịt mềm mọng nước.', 'Đùi gà, Bột chiên, Gia vị', '2025-11-18 15:26:47'),
(6, 'Bánh mì bò nướng', 40000, 'css/banhmibonuong.PNG', 'Bánh mì kẹp thịt bò nướng thơm.', 'Bánh mì, Thịt bò, Dưa leo, Rau thơm', '2025-11-18 15:26:47'),
(7, 'Cơm gà xối mỡ', 52000, 'css/comgaxoimo.WEBP', 'Cơm vàng ươm cùng gà xối mỡ giòn.', 'Cơm, Gà, Dưa leo, Mỡ hành', '2025-11-18 15:26:47'),
(8, 'Bún đậu mắm tôm', 49000, 'css/bundaumamtom.WEBP', 'Combo bún đậu chuẩn vị Bắc.', 'Bún, Đậu phụ, Chả cốm, Mắm tôm', '2025-11-18 15:26:47'),
(10, 'Chè thập cẩm', 27000, 'css/chethapcam.JPG', NULL, 'Đậu đỏ, Thạch, Dừa, Đường', '2025-11-18 15:26:47'),
(12, 'chân gà sốt thái', 30000, 'css/changasotthai.jpg', 'siêu ngon và siêu rẻ', 'chân gà, sốt thái, gia vị', '2025-11-25 12:49:25'),
(13, 'Lẩu thái chua cay', 90000, 'css/lauthaichuacay.jpg', 'lẩu thải chua cay đậm đà', 'lẩu', '2026-01-09 00:59:48');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_phone` varchar(20) NOT NULL,
  `customer_address` varchar(255) NOT NULL,
  `total_money` int(11) NOT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `code` varchar(32) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `customer_name`, `customer_phone`, `customer_address`, `total_money`, `order_date`, `code`, `created_at`) VALUES
(11, 'Trần Công Đạt', '0333186235', '14', 148000, '2025-11-20 16:18:01', 'VKU-6084878448', '2025-11-20 23:18:01'),
(12, 'User', '0869015816', 'Phong Thủy', 89000, '2025-11-20 17:52:01', 'VKU-0f8effd09c', '2025-11-21 00:52:01'),
(13, 'User', '0869015816', 'Phong Thủy', 138000, '2025-11-20 17:52:45', 'VKU-a793b55265', '2025-11-21 00:52:45'),
(14, 'User', '0869015816', '470 TDN', 49000, '2025-11-20 17:53:09', 'VKU-e5b53f473e', '2025-11-21 00:53:09'),
(15, 'Trần Công Đạt', '0869015816', '0', 234000, '2025-11-20 19:36:21', 'MS6BJLSOEJ', '2025-11-21 02:36:21'),
(16, 'Trần Công Đạt', '0333186235', '0', 99000, '2025-11-20 19:37:04', 'S1RQ0GNMQL', '2025-11-21 02:37:04'),
(17, 'Trần Công Đạt', '0869015816', '0', 54000, '2025-11-20 19:39:12', '7XJ9WMD7UV', '2025-11-21 02:39:12'),
(18, 'User', '0333186235', '0', 148000, '2025-11-21 11:09:21', '8MITB1VHLH', '2025-11-21 18:09:21'),
(19, 'User', '0869015816', 'dat', 99000, '2025-11-21 11:13:28', 'B3BGIGPEMO', '2025-11-21 18:13:28'),
(20, 'Trần Công Đạt', '0869015816', 'lll', 98000, '2025-11-21 11:22:31', 'ENW2I98JNT', '2025-11-21 18:22:31'),
(21, 'User', '0869015816', 'qưe', 144000, '2025-11-22 13:30:54', 'KAKBL6COAI', '2025-11-22 20:30:54'),
(22, 'Trần Công Đạt', '0869015816', 'dassss', 148000, '2025-11-22 13:52:50', 'MC21D6XQSA', '2025-11-22 20:52:50'),
(23, 'User', '0869015816', 'phong thủy', 148000, '2025-11-22 14:25:28', 'JBT3F9LQGA', '2025-11-22 21:25:28'),
(24, 'Trần Công Đạt', '0869015816', 'aaa', 153000, '2025-11-23 01:19:13', 'WBNNK2DX6P', '2025-11-23 08:19:13'),
(25, 'Trần Công Đạt', '0869015816', 'aaaaaaaaaaaa', 144000, '2025-11-23 01:22:35', 'PBGZ2X253S', '2025-11-23 08:22:35'),
(26, 'user2', '0649505215', 'Hương Bình', 175000, '2025-11-25 14:51:15', 'IZRLRV8CGM', '2025-11-25 21:51:15'),
(27, 'Trần Công Đạt', '0333186235', 'VKU', 156000, '2025-11-30 04:38:08', 'ST2R97D0UF', '2025-11-30 11:38:08'),
(28, 'Trần Công Đạt', '0333186235', 'zone6', 247000, '2025-12-01 08:18:07', 'DKHOC8RBVU', '2025-12-01 15:18:07'),
(29, 'Trần Công Đạt', '0333186235', '14', 175000, '2025-12-09 04:01:00', 'J47E1OQAU0', '2025-12-09 11:01:00'),
(30, 'Trần Công Đạt', '0333186235', '14', 175000, '2026-01-06 20:49:06', 'AED584AZKS', '2026-01-07 03:49:06'),
(31, 'User', '0869015816', 'Phong Thủy', 148000, '2026-01-09 00:53:44', 'MPOQ0K5W4V', '2026-01-09 07:53:44'),
(32, 'Trần Công Đạt', '0333186235', '14', 178000, '2026-01-09 02:00:03', 'RUD3U5H0I3', '2026-01-09 09:00:03'),
(33, 'user2', '0649505215', 'Hương Bình', 57000, '2026-01-09 03:49:12', '2GJE5ULD82', '2026-01-09 10:49:12'),
(34, 'Trần Công Đạt', '0333186235', '14', 184000, '2026-01-16 11:56:50', 'YUWXMYJ3H8', '2026-01-16 18:56:50');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `dish_name` varchar(255) NOT NULL,
  `price` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `image` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `dish_name`, `price`, `quantity`, `image`) VALUES
(1, 1, '', 89000, 1, '0'),
(2, 2, '', 49000, 1, '0'),
(3, 2, '', 99000, 1, '0'),
(4, 2, '', 27000, 1, '0'),
(5, 2, '', 35000, 1, '0'),
(6, 5, 'Lẩu thái chua cay', 99000, 1, NULL),
(7, 6, 'Lẩu thái chua cay', 99000, 1, NULL),
(8, 7, 'Pizza phô mai', 89000, 1, NULL),
(9, 8, 'Bún đậu mắm tôm', 49000, 1, NULL),
(10, 8, 'Lẩu thái chua cay', 99000, 1, NULL),
(11, 9, 'Chè thập cẩm', 27000, 1, NULL),
(12, 10, 'Chè thập cẩm', 27000, 1, NULL),
(13, 10, 'Lẩu thái chua cay', 99000, 1, NULL),
(14, 11, 'Lẩu thái chua cay', 99000, 1, NULL),
(15, 11, 'Bún đậu mắm tôm', 49000, 1, NULL),
(16, 12, 'Pizza phô mai', 89000, 1, NULL),
(17, 13, 'Mì cay hải sản', 49000, 1, NULL),
(18, 13, 'Pizza phô mai', 89000, 1, NULL),
(19, 14, 'Mì cay hải sản', 49000, 1, NULL),
(20, 15, 'Gà rán giòn', 45000, 3, NULL),
(21, 15, 'Lẩu thái chua cay', 99000, 1, NULL),
(22, 16, 'Lẩu thái chua cay', 99000, 1, NULL),
(23, 17, 'Chè thập cẩm', 27000, 2, NULL),
(24, 18, 'Lẩu thái chua cay', 99000, 1, NULL),
(25, 18, 'Bún đậu mắm tôm', 49000, 1, NULL),
(26, 19, 'Lẩu thái chua cay', 99000, 1, NULL),
(27, 20, 'Bún đậu mắm tôm', 49000, 2, NULL),
(28, 21, 'Combo Burger + Pepsi', 99000, 1, NULL),
(29, 21, 'Gà rán giòn', 45000, 1, NULL),
(30, 22, 'Bún đậu mắm tôm', 49000, 1, NULL),
(31, 22, 'Lẩu thái chua cay', 99000, 1, NULL),
(32, 23, 'Lẩu thái chua cay', 99000, 1, NULL),
(33, 23, 'Bún đậu mắm tôm', 49000, 1, NULL),
(34, 24, 'Chè thập cẩm', 27000, 2, NULL),
(35, 24, 'Lẩu thái chua cay', 99000, 1, NULL),
(36, 25, 'Combo Burger + Pepsi', 99000, 1, NULL),
(37, 25, 'Gà rán giòn', 45000, 1, NULL),
(38, 26, 'Chè thập cẩm', 27000, 1, NULL),
(39, 26, 'Lẩu thái chua cay', 99000, 1, NULL),
(40, 26, 'Bún đậu mắm tôm', 49000, 1, NULL),
(41, 27, 'chân gà sốt thái', 30000, 1, NULL),
(42, 27, 'Chè thập cẩm', 27000, 1, NULL),
(43, 27, 'Lẩu thái chua cay', 99000, 1, NULL),
(44, 28, 'Lẩu thái chua cay', 99000, 2, NULL),
(45, 28, 'Bún đậu mắm tôm', 49000, 1, NULL),
(46, 29, 'Chè thập cẩm', 27000, 1, NULL),
(47, 29, 'Lẩu thái chua cay', 99000, 1, NULL),
(48, 29, 'Bún đậu mắm tôm', 49000, 1, NULL),
(49, 30, 'Chè thập cẩm', 27000, 1, NULL),
(50, 30, 'Lẩu thái chua cay', 99000, 1, NULL),
(51, 30, 'Bún đậu mắm tôm', 49000, 1, NULL),
(52, 31, 'Bún đậu mắm tôm', 49000, 1, NULL),
(53, 31, 'Lẩu thái chua cay', 99000, 1, NULL),
(54, 32, 'Pizza phô mai', 89000, 2, NULL),
(55, 33, 'chân gà sốt thái', 30000, 1, NULL),
(56, 33, 'Chè thập cẩm', 27000, 1, NULL),
(57, 34, 'Combo Burger + Pepsi', 99000, 1, NULL),
(58, 34, 'Bánh mì bò nướng', 40000, 1, NULL),
(59, 34, 'Gà rán giòn', 45000, 1, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL COMMENT 'mã người dùng duy nhất',
  `fullname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'user',
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `dob` date DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `fullname`, `email`, `role`, `password`, `phone`, `address`, `dob`, `avatar`) VALUES
(1, 'Trần Công Đạt', 'trancongdat321@gmail.com', 'admin', '123456', '0333186235', '14', '2006-05-14', 'comgaxoimo.webp'),
(2, 'User', 'dattc.24it@vku.udn.vn', 'user', '$2y$10$n9l7zSM2TZUAdE28dBCmkufxrKznObUO2DOWt16FsZ72gvBRaA/xC', '0869015816', 'Phong Thủy', '2006-05-14', 'banner2.png'),
(3, 'user2', 'eiudungkhok.999@gmail.com', 'user', '$2y$10$U8CpXo6v2NAywHGjiK67tOM/QQHd2J3cPRzsyecoN13fT4kyEIe5q', '0649505215', 'Hương Bình', '1999-04-30', 'delivery.jpg');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `dishes`
--
ALTER TABLE `dishes`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Chỉ mục cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `dishes`
--
ALTER TABLE `dishes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'mã người dùng duy nhất', AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
