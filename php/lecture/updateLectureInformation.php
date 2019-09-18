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
if(!empty($_GET['lectureID'])){
	$lectureID = trim(htmlspecialchars($_GET['lectureID']));

}else{
	echo "Error: must have ID";
	$flag = true;
}	

$complete = trim(htmlspecialchars($_GET['complete']));
$notes = trim(htmlspecialchars($_GET['notes']));
$bookmark = trim(htmlspecialchars($_GET['bookmark']));
$week = trim(htmlspecialchars($_GET['week']));
$title = trim(htmlspecialchars($_GET['title']));


//If passes validation
if($flag == false){
	sleep(2);
	$stmt = $conn->prepare("
		UPDATE lecture_info
		SET completed = ?,
		slideBookmark = ?,
		notes = ?
		WHERE lectureID = ?;");
	$stmt->bind_param('issi',
		$complete,
		$bookmark,
		$notes,
		$lectureID
	);

	if(!$stmt->execute()){
		echo "Error"  . $stmt->error;
	}
	
	$stmt = $conn->prepare("
		UPDATE lecture
		SET week = ?,
		title = ?
		WHERE id = ?;");
	$stmt->bind_param('isi',
		$week,
		$title,
		$lectureID
	);

	if(!$stmt->execute()){
		echo "Error"  . $stmt->error;
	}
}
$conn->close();

?>