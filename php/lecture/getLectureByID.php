<?php 

$servername = "localhost";
$username = "";
$password = "";
$dbname = "lecRev-working";

// Create connection_aborted()
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$flag = false;

//Get variables
if(!empty($_GET['lectureID'])){
	$lecture = trim(htmlspecialchars($_GET['lectureID']));
}else{
	echo "Error: must have lectureID";
	$flag = true;
}


//If passes validation
if($flag == false){
	$stmt = $conn->prepare("SELECT * FROM lecture
		INNER JOIN lecture_info
		ON lecture.id=lecture_info.lectureID
		WHERE lecture.id = ? 
		ORDER BY lecture.week ASC;");
		$stmt->bind_param('i',
		$lecture);

		$stmt->execute();
		$res = $stmt->get_result();
		
	
	$rows = array();
	while($r = $res->fetch_assoc()) {
	    $rows[] = $r;
	}

	echo json_encode($rows);


}


$conn->close();
?>