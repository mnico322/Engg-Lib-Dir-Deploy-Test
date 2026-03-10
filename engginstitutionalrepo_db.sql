-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 10, 2026 at 04:41 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `engginstitutionalrepo_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `firebaseId` varchar(255) DEFAULT NULL,
  `action` varchar(50) DEFAULT NULL,
  `recordFirebaseId` varchar(255) DEFAULT NULL,
  `recordId` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `accessCode` varchar(100) DEFAULT NULL,
  `locationCode` varchar(100) DEFAULT NULL,
  `user` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `timestamp` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `firebaseId`, `action`, `recordFirebaseId`, `recordId`, `title`, `accessCode`, `locationCode`, `user`, `role`, `description`, `timestamp`) VALUES
(1, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 09:19:00'),
(2, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 09:19:06'),
(3, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 09:19:11'),
(4, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 09:19:16'),
(5, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 09:21:00'),
(6, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 09:34:47'),
(7, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 09:37:34'),
(8, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 09:43:35'),
(9, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 09:43:41'),
(10, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 09:43:55'),
(11, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 09:44:50'),
(12, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 09:57:10'),
(13, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 09:57:11'),
(14, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 09:57:25'),
(15, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Accessed Add Record page', '2026-03-05 09:59:49'),
(16, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Accessed Add Record page', '2026-03-05 09:59:49'),
(17, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 10:00:02'),
(18, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 10:02:16'),
(19, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 10:09:02'),
(20, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 10:19:39'),
(21, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 10:20:41'),
(22, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 10:20:42'),
(23, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 10:20:43'),
(24, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 10:20:56'),
(25, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 10:21:02'),
(26, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 10:21:33'),
(27, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 10:21:52'),
(28, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 10:22:18'),
(29, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 10:42:35'),
(30, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 10:42:36'),
(31, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'Performed navigate-add on archive system', '2026-03-05 11:14:07'),
(32, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-05 11:30:14'),
(33, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-05 12:03:14'),
(34, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-05 12:05:54'),
(35, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-05 12:12:37'),
(36, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-05 12:12:47'),
(37, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-05 12:15:25'),
(38, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-05 12:15:28'),
(39, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-05 12:17:41'),
(40, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-05 12:17:47'),
(41, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-05 12:18:49'),
(42, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-05 12:18:52'),
(43, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-05 12:18:59'),
(44, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-05 12:30:51'),
(45, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-05 12:31:04'),
(46, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-05 12:32:24'),
(47, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-05 12:32:26'),
(48, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-05 12:39:07'),
(49, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-05 14:20:07'),
(50, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-05 14:26:54'),
(51, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-05 14:30:10'),
(52, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-05 14:37:43'),
(53, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-05 16:26:24'),
(54, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-05 16:44:24'),
(55, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-05 16:44:38'),
(56, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-05 17:25:10'),
(57, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-06 09:40:46'),
(58, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-06 09:42:10'),
(59, NULL, 'add', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'Added record: Title to College Archives', '2026-03-06 09:44:10'),
(60, NULL, 'view', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 09:44:19'),
(61, NULL, 'view', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 09:44:20'),
(62, NULL, 'view', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 09:44:22'),
(63, NULL, 'view', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 09:44:22'),
(64, NULL, 'view', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 09:54:46'),
(65, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-06 10:19:14'),
(66, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-06 11:29:26'),
(67, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-06 11:39:38'),
(68, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-06 11:39:41'),
(69, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-06 11:39:47'),
(70, NULL, 'add', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'Added record: Student Work 1 to Student Works', '2026-03-06 11:40:31'),
(71, NULL, 'view', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 11:40:33'),
(72, NULL, 'view', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 11:40:34'),
(73, NULL, 'view', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 11:40:41'),
(74, NULL, 'view', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 11:48:01'),
(75, NULL, 'view', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 11:57:27'),
(76, NULL, 'view', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 11:57:29'),
(77, NULL, 'view', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 11:57:32'),
(78, NULL, 'view', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 11:57:35'),
(79, NULL, 'view', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 11:57:38'),
(80, NULL, 'view', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 11:59:10'),
(81, NULL, 'view', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 11:59:10'),
(82, NULL, 'view', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 11:59:11'),
(83, NULL, 'view', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 11:59:13'),
(84, NULL, 'view', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 11:59:15'),
(85, NULL, 'view', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:00:26'),
(86, NULL, 'view', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:00:26'),
(87, NULL, 'view', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:00:26'),
(88, NULL, 'view', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:01:00'),
(89, NULL, 'view', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:01:07'),
(90, NULL, 'view', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:02:33'),
(91, NULL, 'view', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:02:34'),
(92, NULL, 'view', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:02:34'),
(93, NULL, 'view', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:02:41'),
(94, NULL, 'view', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:03:05'),
(95, NULL, 'view', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:03:09'),
(96, NULL, 'view', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:03:16'),
(97, NULL, 'view', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:03:21'),
(98, NULL, 'view', NULL, 1, 'Student Work 1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:03:29'),
(99, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-06 12:03:41'),
(100, NULL, 'add', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'Added record: Title to College Archives', '2026-03-06 12:11:32'),
(101, NULL, 'view', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:11:34'),
(102, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-06 12:11:50'),
(103, NULL, 'add', NULL, 2, 'Title', NULL, NULL, 'Allan', 'librarian', 'Added record: Title to Student Works', '2026-03-06 12:12:36'),
(104, NULL, 'view', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:12:40'),
(105, NULL, 'view', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:12:48'),
(106, NULL, 'view', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:12:51'),
(107, NULL, 'view', NULL, 2, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:13:36'),
(108, NULL, 'view', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:13:40'),
(109, NULL, 'view', NULL, 2, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:13:42'),
(110, NULL, 'view', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:13:49'),
(111, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-06 12:13:55'),
(112, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-06 12:18:02'),
(113, NULL, 'add', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'Added record: Title to Student Works', '2026-03-06 12:18:44'),
(114, NULL, 'view', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:18:47'),
(115, NULL, 'view', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:18:51'),
(116, NULL, 'view', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:18:53'),
(117, NULL, 'view', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:30:33'),
(118, NULL, 'view', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:30:38'),
(119, NULL, 'view', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:31:05'),
(120, NULL, 'view', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:31:09'),
(121, NULL, 'view', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:31:18'),
(122, NULL, 'view', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:31:39'),
(123, NULL, 'view', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:32:19'),
(124, NULL, 'view', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:36:13'),
(125, NULL, 'view', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:36:25'),
(126, NULL, 'view', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:38:00'),
(127, NULL, 'view', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:38:22'),
(128, NULL, 'view', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:49:17'),
(129, NULL, 'view', NULL, 1, 'Title', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:49:24'),
(130, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-06 12:51:02'),
(131, NULL, 'add', NULL, 2, 'Title 2', NULL, NULL, 'Allan', 'librarian', 'Added record: Title 2 to College Archives', '2026-03-06 12:51:57'),
(132, NULL, 'view', NULL, 2, 'Title 2', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 12:52:01'),
(133, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-06 14:13:55'),
(134, NULL, 'add', NULL, 3, '1', NULL, NULL, 'Allan', 'librarian', 'Added record: 1 to College Archives', '2026-03-06 14:14:20'),
(135, NULL, 'view', NULL, 2, 'Title 2', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 14:14:28'),
(136, NULL, 'view', NULL, 3, '1', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 14:14:44'),
(137, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-06 19:41:51'),
(138, NULL, 'add', NULL, 4, '2', NULL, NULL, 'Allan', 'librarian', 'Added record: 2 to College Archives', '2026-03-06 19:42:36'),
(139, NULL, 'view', NULL, 4, '2', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 19:42:39'),
(140, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-06 21:03:20'),
(141, NULL, 'add', NULL, 5, 'Whatver', NULL, NULL, 'Allan', 'librarian', 'Added record: Whatver to College Archives', '2026-03-06 21:04:22'),
(142, NULL, 'view', NULL, 5, 'Whatver', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-06 21:04:31'),
(143, NULL, 'view', NULL, 4, '2', NULL, NULL, 'Allan', 'librarian', 'User viewed a record', '2026-03-07 20:50:42'),
(144, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'unknown', 'guest', 'User undefineded a record', '2026-03-10 10:58:13'),
(145, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'unknown', 'guest', 'User undefineded a record', '2026-03-10 11:28:19');

-- --------------------------------------------------------

--
-- Table structure for table `records`
--

CREATE TABLE `records` (
  `id` int(11) NOT NULL,
  `community` varchar(255) DEFAULT NULL,
  `collection` varchar(255) DEFAULT NULL,
  `subCollection` varchar(255) DEFAULT NULL,
  `subSubCollection` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'active',
  `file_path` varchar(255) DEFAULT NULL,
  `accessCode` varchar(100) DEFAULT NULL,
  `locationCode` varchar(100) DEFAULT NULL,
  `boxNo` varchar(100) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `provenance` varchar(255) DEFAULT NULL,
  `dateCreated` date DEFAULT NULL,
  `title` varchar(500) DEFAULT NULL,
  `materialType` varchar(255) DEFAULT NULL,
  `physicalDescription` text DEFAULT NULL,
  `dateEncoded` date DEFAULT NULL,
  `contentDescription` text DEFAULT NULL,
  `accessLevel` varchar(100) DEFAULT 'Public (Metadata Only)',
  `accessionNumbers` varchar(255) DEFAULT NULL,
  `callNo` varchar(100) DEFAULT NULL,
  `keywords` text DEFAULT NULL,
  `publisher` varchar(255) DEFAULT NULL,
  `placeOfPublication` varchar(255) DEFAULT NULL,
  `yearPublished` varchar(20) DEFAULT NULL,
  `lecturers` varchar(255) DEFAULT NULL,
  `organizer` varchar(255) DEFAULT NULL,
  `format` varchar(100) DEFAULT NULL,
  `event` varchar(255) DEFAULT NULL,
  `venue` varchar(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `contributor` varchar(255) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `faculty` varchar(255) DEFAULT NULL,
  `titleOfConference` varchar(500) DEFAULT NULL,
  `pageNo` varchar(50) DEFAULT NULL,
  `placeOfConference` varchar(255) DEFAULT NULL,
  `dateFrom` date DEFAULT NULL,
  `dateTo` date DEFAULT NULL,
  `abstract` text DEFAULT NULL,
  `citationDatabase` varchar(100) DEFAULT NULL,
  `access` varchar(100) DEFAULT NULL,
  `journalTitle` varchar(255) DEFAULT NULL,
  `volume` varchar(50) DEFAULT NULL,
  `issueNo` varchar(50) DEFAULT NULL,
  `seriesTitle` varchar(255) DEFAULT NULL,
  `professionalChairSponsorTitle` varchar(255) DEFAULT NULL,
  `colloquiumPlace` varchar(255) DEFAULT NULL,
  `bookTitle` varchar(255) DEFAULT NULL,
  `chapterTitle` varchar(255) DEFAULT NULL,
  `chapterNo` varchar(50) DEFAULT NULL,
  `projectTitle` varchar(255) DEFAULT NULL,
  `sponsor` varchar(255) DEFAULT NULL,
  `placeOfResearch` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `records`
--

INSERT INTO `records` (`id`, `community`, `collection`, `subCollection`, `subSubCollection`, `status`, `file_path`, `accessCode`, `locationCode`, `boxNo`, `author`, `provenance`, `dateCreated`, `title`, `materialType`, `physicalDescription`, `dateEncoded`, `contentDescription`, `accessLevel`, `accessionNumbers`, `callNo`, `keywords`, `publisher`, `placeOfPublication`, `yearPublished`, `lecturers`, `organizer`, `format`, `event`, `venue`, `date`, `contributor`, `remarks`, `faculty`, `titleOfConference`, `pageNo`, `placeOfConference`, `dateFrom`, `dateTo`, `abstract`, `citationDatabase`, `access`, `journalTitle`, `volume`, `issueNo`, `seriesTitle`, `professionalChairSponsorTitle`, `colloquiumPlace`, `bookTitle`, `chapterTitle`, `chapterNo`, `projectTitle`, `sponsor`, `placeOfResearch`, `created_at`) VALUES
(1, 'Student Works', '', '', '', 'trashed', NULL, '123', '1', '2', 'Goku', 'COE', NULL, 'Title', 'Directories', NULL, '2026-03-06', NULL, 'Public (Metadata Only)', NULL, NULL, NULL, 'PH', 'QC,PH', '2023', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-06 04:18:44'),
(2, 'College Archives', 'Permanent Records', 'Minutes of the Meetings', 'College Executive Board (CEB)', 'active', 'uploads\\1772772717958-structure.txt', '123', '1', '12', 'Allan', 'COE', '2026-03-06', 'Title 2', 'College Executive Board (CEB)', 'Book', '2026-03-06', NULL, 'Public (Metadata Only)', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-06 04:51:57'),
(3, 'College Archives', 'Publications', 'College of Engineering (COE)', '', 'active', 'uploads\\1772777660169-CS_20_Problem_Set-4.pdf', NULL, NULL, '1', '1', '1', NULL, '1', 'Newspaper', '1', '1111-11-11', '11', 'Public (Metadata & File)', '1', '1', '1', '1', '1', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-06 06:14:20'),
(4, 'College Archives', 'Permanent Records', 'Minutes of the Meetings', 'College Executive Board (CEB)', 'active', 'uploads\\1772797356761-JF26 Shiftee List.pdf', '2', '2', '2', '2', '2', '2222-02-22', '2', 'College Executive Board (CEB)', '1', '2222-02-22', 'hi', 'Public (Metadata & File)', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-06 11:42:36'),
(5, 'College Archives', 'Permanent Records', 'Reports', '', 'active', 'uploads\\1772802262482-Lec4-Transistors-Mosfets.pdf', '123', 'QC', '4', 'Cheese', 'COE', '2026-03-06', 'Whatver', 'Annual Reports', 'Book', '2026-03-06', 'I am a book', 'Public (Metadata & File)', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-06 13:04:22'),
(6, 'College Archives', 'Permanent Records', 'Minutes of the Meetings', 'Others', 'active', 'uploads\\1773113347749-Q5.pdf', '4', '4', '4', 'Nico', '4', '1908-04-04', 'Hi', 'College Executive Board (CEB)', 'Book', '2026-03-10', 'hehe', 'Public (Metadata & File)', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-10 03:29:07');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firebaseId` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('guest','librarian','admin') DEFAULT 'guest',
  `displayName` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `approved` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firebaseId`, `email`, `password`, `role`, `displayName`, `created_at`, `approved`) VALUES
(1, NULL, 'atsalazar@up.edu.ph', '$2b$10$yjd15rfM084mZwKXbE2nsu4qJXT3/wvZjFQbD0jGYApcsjlK5n24i', 'librarian', 'Allan', '2026-02-04 08:31:07', 1),
(2, NULL, 'admin@up.edu.ph', '$2b$10$JQkj9dB3zmROC2dI9DaAvODOBcoVcLEqxR5gPhBMaBX/Wgd1Rxq.6', 'admin', 'admin', '2026-02-19 01:38:54', 1),
(3, NULL, 'librarian@up.edu.ph', '$2b$12$lg/dKWKzaBLHnS6ItnNCTOahEZ.hxxJSCZM3WSzRZepXyW/tZa2Ka', 'librarian', 'librarian', '2026-02-19 02:37:45', 1),
(4, NULL, 'guest@up.edu.ph', '$2b$12$XXsojA.XjJy2u11jlVQYT.KacRJQ2SXlPiCekZDCY6Dx2lyeBqiMi', 'guest', 'guest', '2026-02-19 02:52:04', 1),
(5, NULL, 'admin2@up.edu.ph', '$2b$12$iPuzI/DKPZce4t/7dYcDb.bfYciM1ERNw6CzS8CS.TcWwMZtAWOG6', 'admin', 'admin2', '2026-03-04 07:50:02', 1),
(6, NULL, 'ntmercado2@up.edu.ph', '$2b$12$.27w4LTf243IAOURh8yokebQbKZrbMVo7YtsAV5rYztWG3mmYPYqe', '', 'Nico', '2026-03-06 13:06:26', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `firebaseId` (`firebaseId`);

--
-- Indexes for table `records`
--
ALTER TABLE `records`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `firebaseId` (`firebaseId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=146;

--
-- AUTO_INCREMENT for table `records`
--
ALTER TABLE `records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
