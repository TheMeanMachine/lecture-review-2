<?php
header('Access-Control-Allow-Origin: *');
$servername = "127.0.0.1";
$username = "lectureReview";
$password = "vinesarenotdead";
$dbname = "lecture-review";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

?>