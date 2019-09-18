-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 18, 2019 at 03:54 PM
-- Server version: 10.1.37-MariaDB
-- PHP Version: 7.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lecRev-working`
--

-- --------------------------------------------------------

--
-- Table structure for table `lecture`
--

CREATE TABLE `lecture` (
  `id` int(11) NOT NULL,
  `moduleID` int(11) NOT NULL,
  `week` int(11) NOT NULL,
  `title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `lecture_info`
--

CREATE TABLE `lecture_info` (
  `id` int(11) NOT NULL,
  `lectureID` int(11) NOT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT '1',
  `notes` varchar(500) NOT NULL,
  `slideBookmark` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

CREATE TABLE `modules` (
  `ID` int(11) NOT NULL,
  `code` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `semester` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `archived` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `module_info`
--

CREATE TABLE `module_info` (
  `ID` int(11) NOT NULL,
  `moduleID` int(11) NOT NULL,
  `description` varchar(500) NOT NULL,
  `leader` varchar(255) NOT NULL,
  `color` varchar(255) NOT NULL DEFAULT 'white',
  `credits` int(11) NOT NULL,
  `examPercent` int(11) NOT NULL,
  `cwPercent` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `lecture`
--
ALTER TABLE `lecture`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lectureModuleFK` (`moduleID`);

--
-- Indexes for table `lecture_info`
--
ALTER TABLE `lecture_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lectureInfoFK` (`lectureID`);

--
-- Indexes for table `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `module_info`
--
ALTER TABLE `module_info`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `moduleInfoFK` (`moduleID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `lecture`
--
ALTER TABLE `lecture`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=244;

--
-- AUTO_INCREMENT for table `lecture_info`
--
ALTER TABLE `lecture_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=221;

--
-- AUTO_INCREMENT for table `modules`
--
ALTER TABLE `modules`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `module_info`
--
ALTER TABLE `module_info`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `lecture`
--
ALTER TABLE `lecture`
  ADD CONSTRAINT `lectureModuleFK` FOREIGN KEY (`moduleID`) REFERENCES `modules` (`ID`);

--
-- Constraints for table `lecture_info`
--
ALTER TABLE `lecture_info`
  ADD CONSTRAINT `lectureInfoFK` FOREIGN KEY (`lectureID`) REFERENCES `lecture` (`id`);

--
-- Constraints for table `module_info`
--
ALTER TABLE `module_info`
  ADD CONSTRAINT `moduleInfoFK` FOREIGN KEY (`moduleID`) REFERENCES `modules` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
