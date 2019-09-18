<?php 

$servername = "localhost";
$username = "";
$password = "";
$dbname = "lecRev-working";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$flag = false;


//Get variables
if(!empty($_GET['id'])){
	$id = trim(htmlspecialchars($_GET['id']));
}else{
	echo "Error: must have id";
	$flag = true;
}

//If passes validation
if($flag == false){
	sleep(2);
	$stmt = $conn->prepare("DELETE FROM lecture_info WHERE lectureID = ?");
	$stmt->bind_param('i',
		$id);

	$stmt->execute();

	$stmt = $conn->prepare("DELETE FROM lecture WHERE id = ?");
	$stmt->bind_param('i',
		$id);

	$stmt->execute();

}


$conn->close();
?>