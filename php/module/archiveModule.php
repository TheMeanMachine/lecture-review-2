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
if(!empty($_GET['moduleID'])){
	$moduleID = trim(htmlspecialchars($_GET['moduleID']));

}else{
	echo "Error: must have ID";
	$flag = true;
}

//If passes validation
if($flag == false){
	sleep(3);
	$stmt = $conn->prepare("UPDATE modules SET 
		archived = 2
		WHERE ID = ?;");
	$stmt->bind_param('i',
	$moduleID);

	
	if(!$stmt->execute()){
		echo "Error"  . $stmt->error;
	}

}

$conn->close();

?>