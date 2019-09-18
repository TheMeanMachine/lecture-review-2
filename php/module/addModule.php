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
if(!empty($_GET['year']) && !empty($_GET['semester'])){
	//Mandatory
	$curYear = trim(htmlspecialchars($_GET['year']));
	$curSem = trim(htmlspecialchars($_GET['semester']));
}else{
	echo "Error: must have year and semester";
	$flag = true;
}





//If passes validation
if($flag === false){
	
	sleep(2);

	$stmt = $conn->prepare("INSERT INTO modules (semester, year)
		VALUES (?,?)");
	$stmt->bind_param('ii',
	$curSem,
	$curYear);

	if($stmt->execute()){
		$last_id = $conn->insert_id;//Get the ID from the previous insert

		$stmt = $conn->prepare("INSERT INTO module_info (moduleID)
			VALUES (?)");
		$stmt->bind_param('i',
		$last_id);

		if($stmt->execute()){

			echo json_encode($last_id);
		}else{
			echo "Error"  . $stmt->error;
		}

	}
}


$conn->close();
?>