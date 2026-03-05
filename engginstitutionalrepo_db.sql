-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 05, 2026 at 08:16 AM
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
(52, NULL, 'navigate-add', NULL, NULL, NULL, NULL, NULL, 'Allan', 'librarian', 'User navigate-added a record', '2026-03-05 14:37:43');

-- --------------------------------------------------------

--
-- Table structure for table `records`
--

CREATE TABLE `records` (
  `id` int(11) NOT NULL,
  `accessCode` varchar(100) DEFAULT NULL,
  `boxNo` varchar(50) DEFAULT NULL,
  `collection` varchar(255) DEFAULT NULL,
  `community` varchar(255) DEFAULT NULL,
  `contentDescription` text DEFAULT NULL,
  `creatorAuthor` varchar(255) DEFAULT NULL,
  `dateCreated` varchar(20) DEFAULT NULL,
  `dateEncoded` date DEFAULT NULL,
  `locationCode` varchar(100) DEFAULT NULL,
  `materialType` varchar(255) DEFAULT NULL,
  `physicalDescription` text DEFAULT NULL,
  `provenance` varchar(255) DEFAULT NULL,
  `filePath` varchar(255) DEFAULT NULL,
  `restoredAt` datetime DEFAULT NULL,
  `status` enum('active','trashed') DEFAULT 'active',
  `subCollection` varchar(255) DEFAULT NULL,
  `subSubCollection` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `trashedAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(5, NULL, 'admin2@up.edu.ph', '$2b$12$iPuzI/DKPZce4t/7dYcDb.bfYciM1ERNw6CzS8CS.TcWwMZtAWOG6', 'admin', 'admin2', '2026-03-04 07:50:02', 1);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `records`
--
ALTER TABLE `records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
