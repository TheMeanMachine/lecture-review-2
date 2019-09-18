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

//Validate
if(!empty($_GET['week']) && !empty($_GET['title']) && !empty($_GET['id']) && !empty($_GET['moduleID'])){
	$week = trim(htmlspecialchars($_GET['week']));
	$title = trim(htmlspecialchars($_GET['title']));
	$id = trim(htmlspecialchars($_GET['id']));
	$module = trim(htmlspecialchars($_GET['moduleID']));
}else{
	echo "Error: must have id, week and title, module";
	$flag = true;
}


//If passes validation
if($flag == false){
	sleep(2);

	$stmt = $conn->prepare("UPDATE lecture SET week = '?', title = '?', moduleID = '?' WHERE id = ?");
	$stmt->bind_param('isii',
		$week,
		$title,
		$module,
		$id);

	$stmt->execute();
}
$conn->close();

?>